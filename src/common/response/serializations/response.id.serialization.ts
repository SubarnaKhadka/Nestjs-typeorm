import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { ResponseDefaultSerialization } from 'src/common/doc/serializations/response.default.serialization';

export class ResponseIdSerialization {
  @ApiProperty({
    description: 'Id that representative with your target data',
    example: `120`,
    required: true,
    type: 'int',
    nullable: false,
  })
  @Type(() => Number)
  id: number;
}

export class ResponseIdDefaultSerialization extends ResponseDefaultSerialization {
  @ApiProperty({
    type: ResponseIdSerialization,
  })
  data: ResponseIdDefaultSerialization;
}
