import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { OtpRepository } from '../repositories/otp.repository';
import { DeepPartial, UpdateResult } from 'typeorm';
import { OtpEntity } from '../entities/otp.entity';
import { ICreateOptions } from 'src/common/database/interfaces/createOption.interface';
import { IDeleteOptions } from 'src/common/database/interfaces/deleteOption.interface';
import {
  IFindAllOptions,
  IFindOneOptions,
  IPaginateFindOption,
  IPaginateQueryBuilderOption,
} from 'src/common/database/interfaces/findOption.interface';
import { IPaginationMeta } from 'src/common/response/interfaces/response.interface';
import {
  IUpdateOptions,
  IUpdateRawOptions,
} from 'src/common/database/interfaces/updateOption.interface';
import { QueryDeepPartialEntity } from 'typeorm/query-builder/QueryPartialEntity';
import moment, { Moment } from 'moment';

@Injectable()
export class OtpService {
  constructor(
    private readonly otpRepo: OtpRepository,
    private configService: ConfigService,
  ) {}

  async create(
    createDto: DeepPartial<OtpEntity>,
    options?: ICreateOptions,
  ): Promise<OtpEntity> {
    if (createDto.userId) {
      const found: OtpEntity[] | [] = await this.otpRepo._findAll({
        options: {
          where: {
            userId: createDto.userId,
          },
        },
      });
      if (found && found.length > 0) {
        for (const otp of found) {
          await this.delete(otp, options);
        }
      }
    }
    const data = await this.otpRepo._create(createDto, options);
    return data;
  }
  async getById(
    id: number,
    options?: IFindOneOptions<OtpEntity>,
  ): Promise<OtpEntity | null> {
    const data = await this.otpRepo._findOneById(id, options);
    return data;
  }

  async getOne(options: IFindOneOptions<OtpEntity>): Promise<OtpEntity | null> {
    const data = await this.otpRepo._findOne(options);
    return data;
  }

  async getAll(options?: IFindAllOptions<OtpEntity>): Promise<OtpEntity[]> {
    return await this.otpRepo._findAll(options);
  }

  async paginatedGet(options?: IPaginateFindOption<OtpEntity>): Promise<{
    data: OtpEntity[];
    _pagination: IPaginationMeta;
  }> {
    return await this.otpRepo._paginateFind(options);
  }

  async paginatedQueryBuilderFind(
    options: IPaginateQueryBuilderOption,
  ): Promise<{
    data: OtpEntity[];
    _pagination: IPaginationMeta;
  }> {
    return await this.otpRepo._paginatedQueryBuilder(options);
  }

  async softDelete(
    repo: OtpEntity,
    options?: IUpdateOptions<OtpEntity>,
  ): Promise<OtpEntity> {
    return await this.otpRepo._softDelete(repo, options);
  }

  async delete(
    repo: OtpEntity,
    options?: IDeleteOptions<OtpEntity>,
  ): Promise<OtpEntity> {
    return await this.otpRepo._delete(repo, options);
  }

  async restore(options: IUpdateRawOptions<OtpEntity>): Promise<UpdateResult> {
    return await this.otpRepo._restoreRaw(options);
  }

  async update(
    repo: OtpEntity,
    updateData: QueryDeepPartialEntity<OtpEntity>,
    options?: IUpdateOptions<OtpEntity>,
  ) {
    Object.assign(repo, updateData);
    return await this.otpRepo._update(repo, options);
  }

  generateOtp(length: number): string {
    if (length <= 0) {
      throw new Error('otp.error.nullOtp');
    }
    let otp = '';
    for (let i = 0; i < length; i++) {
      const randomDigit = Math.floor(Math.random() * 10);
      otp += randomDigit;
    }
    return otp;
  }

  getTimeAfterMinutes(minutes: number): Moment {
    if (minutes <= 0) {
      throw new Error('Minutes must be greater than 0');
    }

    return moment().add(minutes, 'minutes');
  }
}
