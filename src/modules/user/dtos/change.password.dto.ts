import { faker } from '@faker-js/faker';
import { ApiProperty } from '@nestjs/swagger';
import { IsString, MaxLength, MinLength } from 'class-validator';

export class ChangePasswordDto {
  @ApiProperty({
    required: false,
    example: faker.internet.password(),
  })
  @IsString()
  @MinLength(8)
  @MaxLength(20)
  password: string;

  @ApiProperty({
    required: false,
    example: faker.internet.password(),
  })
  @IsString()
  @MinLength(1)
  oldPassword: string;
}
