import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BaseRepository } from '../../../common/database/base/repositories/base.repository';
import { OtpEntity } from '../entities/otp.entity';

@Injectable()
export class OtpRepository extends BaseRepository<OtpEntity> {
  constructor(
    @InjectRepository(OtpEntity)
    private otpRepo: Repository<OtpEntity>,
  ) {
    super(otpRepo);
  }
}
