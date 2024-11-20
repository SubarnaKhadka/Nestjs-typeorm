import { UserRepositoryModule } from './../user/repositories/user.repository.module';
import { Module } from '@nestjs/common';
import { AuthenticationService } from './services/authentication.service';
import { CustomCacheModule } from 'src/common/cache/cache.module';
import { UserModule } from '../user/user.module';
import { AuthModule } from 'src/common/auth/auth.module';
import { OtpModule } from '../otp/otp.module';
import { SmsModule } from 'src/common/sms/sms.module';
import { MailerModule } from 'src/common/mailer/mailer.module';

@Module({
  imports: [CustomCacheModule, UserModule, AuthModule,OtpModule,SmsModule,MailerModule],
  providers: [AuthenticationService],
  exports: [AuthenticationService],
})
export class AuthenticationModule {}
