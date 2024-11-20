import { Module } from '@nestjs/common';
import { BackUpService } from './services/backup.service';
import { HelperBackupService } from './services/helper.backup.service';
import { AwsModule } from 'src/common/aws/aws.module';
import { BackupCronJob } from './cron/backup.cron';

@Module({
  imports: [AwsModule],
  providers: [BackUpService, HelperBackupService, BackupCronJob],
  exports: [BackUpService, HelperBackupService, BackupCronJob],
})
export class BackUpModule {}
