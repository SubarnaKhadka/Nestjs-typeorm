import { Module } from '@nestjs/common';
import { FileRepository } from './file.repository';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FileEntity } from '../entities/file.entity';

@Module({
  providers: [FileRepository],
  exports: [FileRepository],
  controllers: [],
  imports: [TypeOrmModule.forFeature([FileEntity])],
})
export class FileRepositoryModule {}
