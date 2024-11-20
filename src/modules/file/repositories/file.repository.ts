import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BaseRepository } from '../../../common/database/base/repositories/base.repository';
import { Injectable } from '@nestjs/common';
import { FileEntity } from '../entities/file.entity';

@Injectable()
export class FileRepository extends BaseRepository<FileEntity> {
  constructor(
    @InjectRepository(FileEntity)
    private fileRepository: Repository<FileEntity>,
  ) {
    super(fileRepository);
  }
}
