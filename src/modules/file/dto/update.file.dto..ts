import { faker } from '@faker-js/faker';
import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString, MinLength } from 'class-validator';

export class UpdateFileDto {
  @ApiProperty({
    required: false,
    example: faker.person.firstName(),
    type: 'string',
  })
  @IsOptional()
  @IsString()
  @MinLength(1)
  name?: string | undefined;

  @ApiProperty({
    required: false,
    type: 'string',
    example: faker.person.firstName(),
  })
  @IsOptional()
  @IsString()
  @MinLength(1)
  description?: string | undefined;
}
