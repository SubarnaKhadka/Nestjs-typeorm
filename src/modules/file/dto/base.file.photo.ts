import { ApiProperty } from '@nestjs/swagger';
import { IFileInterface } from '../interfaces/file.interfaces';
import { faker } from '@faker-js/faker';
import {
  IsBoolean,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';

export class BasePhoto implements IFileInterface {
  @ApiProperty({
    required: true,
    example: 1,
  })
  @IsNumber()
  @IsNotEmpty()
  id: number;

  @ApiProperty({
    required: false,
    example: faker.internet.url(),
  })
  @IsString()
  @IsOptional()
  path?: string;

  @ApiProperty({
    required: false,
    example: faker.lorem.word(),
  })
  @IsString()
  @IsOptional()
  filename?: string;

  @ApiProperty({
    required: false,
    example: faker.lorem.word(),
  })
  @IsString()
  @IsOptional()
  mime?: string;

  @ApiProperty({
    required: false,
    example: faker.internet.url(),
  })
  @IsString()
  @IsOptional()
  completeUrl?: string;

  @ApiProperty({
    required: false,
    example: faker.internet.url(),
  })
  @IsString()
  @IsOptional()
  baseUrl?: string;

  @ApiProperty({
    required: false,
    example: faker.number.int(),
  })
  @IsOptional()
  @IsString()
  size?: number;

  @ApiProperty({
    required: false,
    example: faker.datatype.boolean(),
  })
  @IsOptional()
  @IsBoolean()
  isFeatured?: boolean;

  @ApiProperty({
    required: false,
    example: faker.number.int(),
  })
  @IsOptional()
  @IsNumber()
  index?: number | null;
}
