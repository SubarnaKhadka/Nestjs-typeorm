import { Module } from '@nestjs/common';
import { OtpService } from './services/otp.service';
import { OtpRepositoryModule } from './repositories/otp.repository.module';

@Module({
  providers: [OtpService],
  exports: [OtpService],
  imports: [OtpRepositoryModule],
})
export class OtpModule {}
