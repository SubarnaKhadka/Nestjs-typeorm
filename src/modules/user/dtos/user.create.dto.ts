import { faker } from '@faker-js/faker';
import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsDateString,
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
  MinLength,
  ValidateNested,
} from 'class-validator';
import { ENUM_USER_GENDER } from '../constants/user.enum.constant';
import { IsPasswordStrong } from 'src/common/request/validations/request.is-password-strong.validation';
import { IUser, IUserNameJson } from '../interfaces/user.interface';
import { CustomIsPastDate } from 'src/common/request/validations/custom-validator';

export class UserNameJsonDto implements IUserNameJson {
  @ApiProperty({
    required: false,
    example: faker.person.firstName(),
  })
  @IsOptional()
  @IsString()
  @MinLength(1)
  firstName?: string | null;

  @ApiProperty({
    required: false,
    example: faker.person.middleName(),
  })
  @IsOptional()
  @IsString()
  @MinLength(1)
  middleName?: string | null;

  @ApiProperty({
    required: false,
    example: faker.person.lastName(),
  })
  @IsOptional()
  @IsString()
  @MinLength(1)
  lastName?: string | null;
}

export class UserCreateDto implements IUser {
  @ApiProperty({
    example: 'admin@gmail.com',
    required: true,
  })
  @IsEmail()
  @IsOptional()
  @MaxLength(100)
  @Type(() => String)
  readonly email?: string;

  @ApiProperty({
    type: UserNameJsonDto,
    required: true,
  })
  @ValidateNested()
  @Type(() => UserNameJsonDto)
  readonly name: UserNameJsonDto;

  @ApiProperty({
    example: ENUM_USER_GENDER.MALE,
    required: true,
  })
  @IsOptional()
  @IsEnum(ENUM_USER_GENDER)
  @Type(() => String)
  readonly gender: string;

  @ApiProperty({
    example: `9876543210`,
    required: true,
  })
  @IsString()
  @IsOptional()
  @MinLength(10)
  @MaxLength(10)
  @Type(() => String)
  readonly phone?: string;

  @ApiProperty({
    required: false,
    example: '2003-02-09',
  })
  @IsDateString()
  @CustomIsPastDate({ message: 'Date of birth must be a past date' })
  dob?: Date;

  @ApiProperty({
    description: 'strong password',
    example: 'Test@123',
    required: true,
  })
  @IsNotEmpty()
  @IsPasswordStrong()
  @MaxLength(50)
  readonly password: string;
}
