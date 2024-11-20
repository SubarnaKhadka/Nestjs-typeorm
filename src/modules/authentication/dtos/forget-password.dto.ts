import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  IsNotEmpty,
  IsNumberString,
  IsString,
  MaxLength,
  MinLength,
  ValidateIf,
} from 'class-validator';

export class ForgetPasswordDto {
  @ApiProperty({
    required: true,
    type: 'string',
    example: '987654321',
  })
  @ValidateIf((v) => !v.email)
  @IsNotEmpty()
  @IsString()
  @MinLength(10)
  @MaxLength(10)
  @IsNumberString({}, { message: 'Phone must be number' })
  phone?: string;

  //   @ApiProperty({
  //     required: true,
  //     type: 'string',
  //     example: 'admin@gmail.com',
  //   })
  @ValidateIf((v) => !v.phone)
  @IsNotEmpty()
  @IsEmail()
  email?: string;
}

export class ForgetPasswordSetDto extends ForgetPasswordDto {
  @ApiProperty({
    required: true,
    type: 'string',
    example: '123456',
  })
  @IsNotEmpty()
  @IsString()
  otp: string;

  @ApiProperty({
    required: true,
    type: 'string',
  })
  @MinLength(1)
  @IsNotEmpty()
  @IsString()
  password: string;
}
