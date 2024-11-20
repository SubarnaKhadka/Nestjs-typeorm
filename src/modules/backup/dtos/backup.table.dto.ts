import { ApiProperty } from '@nestjs/swagger';
import {
  CustomIsArray,
  CustomIsNotEmpty,
} from 'src/common/request/validations/custom-validator';

export class TableDtos {
  @ApiProperty({
    type: [String],
    required: true,
  })
  @CustomIsArray()
  @CustomIsNotEmpty()
  tables: string[];
}
