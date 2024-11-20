import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { HttpLogsRepository } from './http-log.repository';
import { HttpLogsEntity } from '../entities/http-logs.entity';

@Module({
  providers: [HttpLogsRepository],
  exports: [HttpLogsRepository],
  imports: [TypeOrmModule.forFeature([HttpLogsEntity])],
})
export class HttpLogsRepositoryModule {}
