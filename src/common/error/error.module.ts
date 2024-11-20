import { Module } from '@nestjs/common';
import { ErrorFilter } from './filters/error.filter';
import { APP_FILTER } from '@nestjs/core';
import { HttpLogsModule } from 'src/modules/http-logs/http-logs.module';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [HttpLogsModule, ConfigModule],
  providers: [
    {
      provide: APP_FILTER,
      useClass: ErrorFilter,
    },
  ],
})
export class ErrorModule {}
