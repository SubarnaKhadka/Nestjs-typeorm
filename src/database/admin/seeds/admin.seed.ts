import { Injectable } from '@nestjs/common';
import { Command } from 'nestjs-command';
import { AuthService } from 'src/common/auth/services/auth.service';
import { USER_TYPE } from 'src/modules/user/interfaces/user.interface';
import { UserService } from 'src/modules/user/services/user.service';
import { QueryRunner, DataSource } from 'typeorm';

@Injectable()
export class MigrateDefaultAdminUser {
  constructor(
    private readonly connection: DataSource,
    private readonly userService: UserService,
  ) {}

  @Command({
    command: 'seed:admin',
    describe: 'seeds defaultAdmin User',
  })
  async seeds(): Promise<void> {
    const queryRunner: QueryRunner = this.connection.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const existingAdmin = await this.userService.getOne({
        options: {
          where: {
            email: 'admin@gmail.com',
          },
        },
      });

      if (existingAdmin) {
        console.log('Complete');
        return;
      }

      await this.userService.create(
        {
          email: 'admin@gmail.com',
          phone: '9800000000',
          countryCode: '977',
          username: 'admin',
          password: 'Test@123',
          registeredAt: new Date(),
          phoneVerifiedAt: new Date(),
          emailVerifiedAt: new Date(),
          type: USER_TYPE.ADMIN,
        },
        { entityManager: queryRunner.manager },
      );
      await queryRunner.commitTransaction();
      console.log('Complete');
    } catch (error) {
      console.log('error', error);
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
    }
  }

  @Command({
    command: 'remove:admin',
    describe: 'remove defaultAdmin User',
  })
  async remove(): Promise<void> {
    const queryRunner: QueryRunner = this.connection.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const existingDefaultAdmin = await this.userService.getOne({
        options: {
          where: {
            email: 'admin@gmail.com',
          },
        },
      });

      if (!existingDefaultAdmin) {
        throw new Error('There is no default admin');
      }

      await this.userService.delete(existingDefaultAdmin);
      await queryRunner.commitTransaction();
      console.log('Complete');
    } catch (error) {
      console.log('error', error);
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
    }
  }
}
