import { ApiProperty } from '@nestjs/swagger';
import { ResponseDefaultSerialization } from 'src/common/doc/serializations/response.default.serialization';

export class BackUpTableSerialization extends ResponseDefaultSerialization {
  @ApiProperty({
    type: String,
    example: 'Create tables BackUp.',
  })
  message: string;
}
