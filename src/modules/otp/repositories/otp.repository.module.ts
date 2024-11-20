import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OtpEntity } from '../entities/otp.entity';
import { OtpRepository } from './otp.repository';

@Module({
  providers: [OtpRepository],
  exports: [OtpRepository],
  controllers: [],
  imports: [TypeOrmModule.forFeature([OtpEntity])],
})
export class OtpRepositoryModule {}
