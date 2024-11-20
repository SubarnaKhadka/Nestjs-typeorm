import { ApiProperty } from '@nestjs/swagger';
import {
  ResponseDefaultSerialization,
  ResponsePaginationDefaultSerialization,
} from 'src/common/doc/serializations/response.default.serialization';
import { HttpLogsEntity } from '../entities/http-logs.entity';

export class HttpLogsResponseSerialization extends ResponseDefaultSerialization {
  @ApiProperty({
    type: HttpLogsEntity,
  })
  data: HttpLogsEntity;
}

export class HttpLogsPaginationSerialization extends ResponsePaginationDefaultSerialization {
  @ApiProperty({
    type: [HttpLogsEntity],
  })
  data: HttpLogsEntity;
}
