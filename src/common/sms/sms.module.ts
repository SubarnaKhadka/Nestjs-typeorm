import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { SmsService } from './services/sms.service';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Module({
  providers: [SmsService],
  imports: [
    HttpModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async () => ({
        timeout: 30000,  //30 sec
      }),
      inject: [ConfigService],
    }),
  ],
  exports: [SmsService],
})
export class SmsModule {}
