import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BaseRepository } from '../../../common/database/base/repositories/base.repository';
import { HttpLogsEntity } from '../entities/http-logs.entity';

@Injectable()
export class HttpLogsRepository extends BaseRepository<HttpLogsEntity> {
  constructor(
    @InjectRepository(HttpLogsEntity)
    private repo: Repository<HttpLogsEntity>,
  ) {
    super(repo);
  }
}
