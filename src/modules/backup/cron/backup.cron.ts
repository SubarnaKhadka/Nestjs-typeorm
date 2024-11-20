import { Injectable } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { BackUpService } from '../services/backup.service';

@Injectable()
export class BackupCronJob {
  constructor(private readonly backupService: BackUpService) {}

  @Cron(CronExpression.EVERY_DAY_AT_9PM)
  async handleBackupCron() {
    this.backupService.dump();
  }
}
