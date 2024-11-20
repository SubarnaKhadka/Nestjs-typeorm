import { ApiProperty } from '@nestjs/swagger';
import { ResponseDefaultSerialization } from 'src/common/doc/serializations/response.default.serialization';

export class BackUpDataBaseSerialization extends ResponseDefaultSerialization {
  @ApiProperty({
    type: String,
    example: 'Create Database BackUp.',
  })
  message: string;
}
