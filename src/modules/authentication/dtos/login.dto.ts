import { faker } from '@faker-js/faker';
import { ApiProperty } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsNumberString,
  IsString,
  MaxLength,
  MinLength,
  ValidateIf,
} from 'class-validator';

export class LoginDto {
  // @ApiProperty({
  //     required: false,
  //     example: faker.internet.userName(),
  // })
  // @ValidateIf((v) => !v?.email && !v?.phone)
  // @MinLength(1)
  // @IsNotEmpty()
  // @IsString()
  // username: string;

  // @ApiProperty({
  //     required: false,
  //     example: faker.internet.email(),
  // })
  @ValidateIf((v) => !v?.username && !v?.phone)
  @MinLength(1)
  @IsNotEmpty()
  @IsString()
  email: string;

  @ApiProperty({
    required: false,
    example: '9800000000',
  })
  @ValidateIf((v) => !v?.email && !v?.username)
  @MinLength(10)
  @MaxLength(10)
  @IsNumberString({}, { message: 'Phone must be number' })
  @IsNotEmpty()
  @IsString()
  phone: string;

  @ApiProperty({
    required: false,
    example: faker.internet.password(),
  })
  @MinLength(1)
  @IsNotEmpty()
  @IsString()
  password: string;
}

export class AdminLoginDto {
  @ApiProperty({
    required: false,
    example: faker.internet.email(),
  })
  @ValidateIf((v) => !v?.username && !v?.phone)
  @MinLength(1)
  @IsNotEmpty()
  @IsString()
  email: string;

  // @ApiProperty({
  //   required: false,
  //   example: '9800000000',
  // })
  @ValidateIf((v) => !v?.email && !v?.username)
  @MinLength(10)
  @MaxLength(10)
  @IsNumberString({}, { message: 'Phone must be number' })
  @IsNotEmpty()
  @IsString()
  phone: string;

  @ApiProperty({
    required: false,
    example: faker.internet.password(),
  })
  @MinLength(1)
  @IsNotEmpty()
  @IsString()
  password: string;
}
