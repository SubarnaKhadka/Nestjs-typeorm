import { Module } from '@nestjs/common';
import { HttpLogsRepositoryModule } from './repository/http-log.repository.module';
import { HttpLogsService } from './services/http-logs.service';
import { HttpLogCronJob } from './cron-job/http-log.cron-job';
import { ScheduleModule } from '@nestjs/schedule';

@Module({
  providers: [HttpLogsService, HttpLogCronJob],
  imports: [HttpLogsRepositoryModule, ScheduleModule.forRoot()],
  exports: [HttpLogsService, HttpLogCronJob],
})
export class HttpLogsModule {}
