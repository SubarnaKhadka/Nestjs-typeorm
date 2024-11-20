import { HttpLogsModule } from 'src/modules/http-logs/http-logs.module';
import { Module } from '@nestjs/common';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { ResponseDefaultInterceptor } from './interceptors/response.interceptor';
import { ResponseMiddlewareModule } from './middleware/response.middleware.module';
import { ConfigModule } from '@nestjs/config';
import { MessageModule } from '../message/message.module';

@Module({
  controllers: [],
  providers: [
    {
      provide: APP_INTERCEPTOR,
      useClass: ResponseDefaultInterceptor,
    },
  ],
  imports: [
    HttpLogsModule,
    ResponseMiddlewareModule,
    ConfigModule,
    MessageModule,
  ],
})
export class ResponseModule {}
