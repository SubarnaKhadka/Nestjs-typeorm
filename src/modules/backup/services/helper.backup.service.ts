import { Injectable } from '@nestjs/common';
import { AwsS3SerializationCustom } from 'src/common/aws/serializations/aws.s3.serialization';
import { AwsS3Service } from 'src/common/aws/services/aws.s3.service';

@Injectable()
export class HelperBackupService {
  constructor(private readonly awsS3Service: AwsS3Service) {}

  async deletePreviousBackup(
    array: AwsS3SerializationCustom[],
    bucketName: string,
    maxDatabaseBackup: number,
  ) {
    if (array.length <= maxDatabaseBackup) {
      return;
    }
    const result: AwsS3SerializationCustom[] = array.sort(
      (a: AwsS3SerializationCustom, b: AwsS3SerializationCustom) =>
        new Date(b.lastModified).getTime() - new Date(a.lastModified).getTime(),
    );

    result.splice(0, maxDatabaseBackup);

    const pathWithFilenames: string[] = result.map(
      (obj: AwsS3SerializationCustom) => obj.pathWithFilename,
    );
    if (pathWithFilenames.length === 0) {
      return;
    }
    try {
      await this.awsS3Service.deleteBackupItemsInBucket(
        pathWithFilenames,
        bucketName,
      );
    } catch (error) {
      console.log('~ error:', error);
    }

    return result;
  }
}
