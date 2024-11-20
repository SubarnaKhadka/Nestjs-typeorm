import { ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsDateString,
  IsEnum,
  IsInt,
  IsNotEmpty,
  IsOptional,
  Max,
  Min,
  ValidateIf,
} from 'class-validator';

enum DateRangeType {
  RANGE = 'RANGE',
  DATE = 'DATE',
  MONTH = 'MONTH',
  YEAR = 'YEAR',
  WEEK = 'WEEK',
}

export class DateRangeQueryDto {
  @ApiPropertyOptional({
    description: 'Type of date range',
    enum: DateRangeType,
  })
  @IsOptional()
  @IsEnum(DateRangeType)
  dateRangeType: DateRangeType;

  @ApiPropertyOptional({
    description: 'The reference date for DATE and WEEK types, eg: `2023-03-28`',
  })
  @IsOptional()
  @IsDateString()
  date?: string;

  @ApiPropertyOptional({
    description:
      'Start date for RANGE type, eg:`2024-03-28T05:39:23.248+00:00`',
  })
  @ValidateIf((o) => o.dateRangeType === DateRangeType.RANGE)
  @IsNotEmpty()
  @IsDateString()
  fromDate?: string;

  @ApiPropertyOptional({
    description: 'End date for RANGE type, eg:`2024-03-28T05:39:23.248+00:00`',
  })
  @ValidateIf((o) => o.dateRangeType === DateRangeType.RANGE)
  @IsNotEmpty()
  @IsDateString()
  toDate?: string;

  @ApiPropertyOptional({
    description: 'Month (0-11) for MONTH type',
  })
  @Type(() => Number)
  @IsOptional()
  @Max(11)
  @Min(0)
  month?: number;

  @ApiPropertyOptional({
    description: 'Year for MONTH and YEAR types, eg : `2023`',
  })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(2000)
  @Max(4000)
  year?: number;
}
