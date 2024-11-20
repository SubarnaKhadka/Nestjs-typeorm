import { ApiProperty } from '@nestjs/swagger';
import {
  ResponseDefaultSerialization,
  ResponsePaginationDefaultSerialization,
} from 'src/common/doc/serializations/response.default.serialization';
import { FileEntity } from '../entities/file.entity';

export class FileSerialization extends ResponseDefaultSerialization {
  @ApiProperty({
    type: FileEntity,
  })
  data: FileEntity;
}

export class FilePaginationSerialization extends ResponsePaginationDefaultSerialization {
  @ApiProperty({
    type: [FileEntity],
  })
  data: FileEntity;
}
