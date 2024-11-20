import { Injectable } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { HttpLogsRepository } from '../repository/http-log.repository';

@Injectable()
export class HttpLogCronJob {
  constructor(private readonly repository: HttpLogsRepository) {}

  @Cron(CronExpression.EVERY_1ST_DAY_OF_MONTH_AT_MIDNIGHT)
  async handleCron() {
    try {
      await this.repository._deleteRaw({
        where: {},
      });
    } catch (error) {
      console.log(error);
    }
  }
}
