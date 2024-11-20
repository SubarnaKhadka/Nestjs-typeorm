import { Injectable } from '@nestjs/common';
import { Response } from 'express';
import { IDeleteOptions } from 'src/common/database/interfaces/deleteOption.interface';
import {
  IFindAllOptions,
  IFindOneOptions,
  IPaginateFindOption,
  IPaginateQueryBuilderOption,
} from 'src/common/database/interfaces/findOption.interface';
import {
  IUpdateOptions,
  IUpdateRawOptions,
} from 'src/common/database/interfaces/updateOption.interface';
import { IRequestApp } from 'src/common/request/interfaces/request.interface';
import { IPaginationMeta } from 'src/common/response/interfaces/response.interface';
import { DeepPartial, UpdateResult } from 'typeorm';
import { HttpLogsEntity } from '../entities/http-logs.entity';
import { HttpLogsRepository } from '../repository/http-log.repository';

@Injectable()
export class HttpLogsService {
  constructor(private readonly httpLogsRepo: HttpLogsRepository) {}

  async create(
    request: IRequestApp,
    response: Response,
    metadata: Record<string, any>,
  ): Promise<void> {
    const {
      ip,
      originalUrl,
      query,
      method,
      params,
      hostname,
      __timestamp,
      __timezone,
      user,
      __user,
      headers,
    } = request;
    const { 'user-agent': userAgent } = headers;
    const logMessage: DeepPartial<HttpLogsEntity> = {
      remoteAddress: ip,
      remoteUserId: user?.id || __user?.id || null,
      url: originalUrl,
      queryParams: query,
      params: params,
      userAgent: userAgent,
      timezone: __timezone,
      hostname: hostname,
      responseCode: response.statusCode,
      responseTime: Date.now() - __timestamp,
      method: method,
      timestamp: __timestamp,
      metadata: metadata,
    };
    await this.httpLogsRepo._create(logMessage);
  }

  async getById(
    id: number,
    options?: IFindOneOptions<HttpLogsEntity>,
  ): Promise<HttpLogsEntity | null> {
    const data = await this.httpLogsRepo._findOneById(id, options);
    return data;
  }

  async getOne(
    options: IFindOneOptions<HttpLogsEntity>,
  ): Promise<HttpLogsEntity | null> {
    const data = await this.httpLogsRepo._findOne(options);
    return data;
  }

  async getAll(
    options?: IFindAllOptions<HttpLogsEntity>,
  ): Promise<HttpLogsEntity[]> {
    return await this.httpLogsRepo._findAll(options);
  }

  async paginatedGet(options?: IPaginateFindOption<HttpLogsEntity>): Promise<{
    data: HttpLogsEntity[];
    _pagination: IPaginationMeta;
  }> {
    return await this.httpLogsRepo._paginateFind(options);
  }

  async paginatedQueryBuilderFind(
    options: IPaginateQueryBuilderOption,
  ): Promise<{
    data: HttpLogsEntity[];
    _pagination: IPaginationMeta;
  }> {
    return await this.httpLogsRepo._paginatedQueryBuilder(options);
  }

  async softDelete(
    repo: HttpLogsEntity,
    options?: IUpdateOptions<HttpLogsEntity>,
  ): Promise<HttpLogsEntity> {
    return await this.httpLogsRepo._softDelete(repo, options);
  }

  async delete(
    repo: HttpLogsEntity,
    options?: IDeleteOptions<HttpLogsEntity>,
  ): Promise<HttpLogsEntity> {
    return await this.httpLogsRepo._delete(repo, options);
  }

  async restore(
    options: IUpdateRawOptions<HttpLogsEntity>,
  ): Promise<UpdateResult> {
    return await this.httpLogsRepo._restoreRaw(options);
  }
}
