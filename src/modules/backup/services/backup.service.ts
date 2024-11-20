import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { exec } from 'child_process';
import * as fs from 'fs';
import moment from 'moment';
import * as fsPromise from 'node:fs/promises';
import { AwsS3SerializationCustom } from 'src/common/aws/serializations/aws.s3.serialization';
import { AwsS3Service } from 'src/common/aws/services/aws.s3.service';
import { TableDtos } from '../dtos/backup.table.dto';
import { HelperBackupService } from './helper.backup.service';

@Injectable()
export class BackUpService {
  maxDatabaseTableBackup: number;
  maxDatabaseBackup: number;
  environment: string;
  constructor(
    private readonly configService: ConfigService,
    private readonly awsS3Service: AwsS3Service,
    private readonly helperBackService: HelperBackupService,
  ) {
    this.maxDatabaseTableBackup =
      this.configService.get<number>('app.maxDatabaseTableBackup') || 5;
    this.maxDatabaseBackup =
      this.configService.get<number>('app.maxDatabaseBackup') || 5;
    this.environment =
      this.configService.get<string>('app.env') || 'development';
  }
  private readonly logger = new Logger(BackUpService.name);

  //#region Dump Database
  /**
   * To Dump Database
   */
  async dump(): Promise<void> {
    const bucketName = 'hamro-event';
    const bucketPath = `${this.environment}/backup/database`;
    const bucketBaseUrl = 'https://hamro-event.s3.amazonaws.com';
    try {
      const date = moment().format('YYYY_MM_DD_HH_mm');
      const dbName = this.configService.get<string>('database.name');
      const dbUser = this.configService.get<string>('database.username');
      const dbPassword = this.configService.get<string>('database.password');
      const host = this.configService.get<string>('database.host');
      const backupPath = `./backup/database`;

      this.ensureDirectoryExistence(backupPath);
      const backupFileName = `${this.environment}_database_dump_${date}.tar`;

      const backupPathWithFileName = backupPath + `/` + backupFileName;
      const dumpCommand = `pg_dump -F t -h ${host} -U ${dbUser} ${dbName} > ${backupPathWithFileName}`;

      // docker exec -t your_container_name_or_id pg_dump -U postgres -F t postgres > ./backup/database/database_dump_2024_04_12_11_29.tar

      const env = { ...process.env, PGPASSWORD: dbPassword }; //Avoiding password prompt
      await new Promise<void>((resolve, reject) => {
        exec(dumpCommand, { env }, (error) => {
          // Inputting password while executing the command
          if (error) {
            return reject(error);
          }
          return resolve();
        });
      });

      //upload file to s3
      const fileContent = await fsPromise.readFile(backupPathWithFileName);
      await this.awsS3Service.putItemInBucket(
        backupFileName,
        bucketName,
        fileContent,
        {
          path: bucketPath,
          baseUrl: bucketBaseUrl,
        },
      );

      // Delete the backup file from system
      fsPromise.unlink(backupPathWithFileName);

      const s3Content: AwsS3SerializationCustom[] =
        await this.awsS3Service.listAllItemInBucket({
          bucket: bucketName,
          prefix: bucketPath,
        });

      await this.helperBackService.deletePreviousBackup(
        s3Content,
        bucketName,
        this.maxDatabaseBackup,
      );

      this.logger.log(
        `Database backup created successfully: ${backupPathWithFileName}`,
      );
    } catch (error) {
      this.logger.error(`Failed to create database backup: ${error.message}`);
      throw error;
    }
  }

  //#region Dump Database Table Only
  /**
   * To Dump Database Table Only
   */
  async dumpTables(incomingData: TableDtos): Promise<void> {
    const bucketName = 'hamro-event';
    const bucketPath = `${this.environment}/backup/tables`;
    const bucketBaseUrl = 'https://hamro-event.s3.amazonaws.com';

    try {
      const { tables } = incomingData;
      const date = moment().format('YYYY_MM_DD_HH_mm');
      const dbName = this.configService.get<string>('database.name');
      const dbUser = this.configService.get<string>('database.username');
      const dbPassword = this.configService.get<string>('database.password');
      const host = this.configService.get<string>('database.host');

      const backupPath = `./backup/tables`;

      this.ensureDirectoryExistence(backupPath);

      const backupFileName = `${this.environment}_database_tables_dump_${date}.tar`;

      const backupPathWithFileName = backupPath + `/` + backupFileName;

      const tableOptions = tables.map((table) => `-t ${table}`).join(' ');

      const dumpCommand = `pg_dump -F t -U ${dbUser} -h ${host} ${tableOptions} ${dbName} > ${backupPathWithFileName}`;
      const env = { ...process.env, PGPASSWORD: dbPassword }; //Avoiding password prompt
      await new Promise<void>((resolve, reject) => {
        exec(dumpCommand, { env }, (error) => {
          // Inputting password while executing the command
          if (error) {
            return reject(error);
          }
          return resolve();
        });
      });

      //upload file to s3
      const fileContent = await fsPromise.readFile(backupPathWithFileName);
      await this.awsS3Service.putItemInBucket(
        backupFileName,
        bucketName,
        fileContent,
        {
          path: bucketPath,
          baseUrl: bucketBaseUrl,
        },
      );

      // Delete the backup file from system
      fsPromise.unlink(backupPathWithFileName);

      const s3Content: AwsS3SerializationCustom[] =
        await this.awsS3Service.listAllItemInBucket({
          bucket: bucketName,
          prefix: bucketPath,
        });

      await this.helperBackService.deletePreviousBackup(
        s3Content,
        bucketName,
        this.maxDatabaseBackup,
      );
      this.logger.log(
        `Database backup created successfully: ${backupPathWithFileName}`,
      );
    } catch (error) {
      this.logger.error(`Failed to create database backup: ${error.message}`);

      throw error;
    }
  }

  ensureDirectoryExistence(folderPath: string) {
    if (!fs.existsSync(folderPath)) {
      fs.mkdirSync(folderPath, { recursive: true });
    }
  }
}
