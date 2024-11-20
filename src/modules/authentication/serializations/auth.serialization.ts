import { faker } from '@faker-js/faker';
import { ApiProperty } from '@nestjs/swagger';
import { ResponseDefaultSerialization } from 'src/common/doc/serializations/response.default.serialization';

export class AuthToken {
  @ApiProperty({
    example: 'Bearer',
    required: true,
    nullable: false,
  })
  readonly tokenType: string;

  @ApiProperty({
    example: 3600,
    description: 'timestamp in minutes',
    required: true,
    nullable: false,
  })
  readonly expiresIn: number;

  @ApiProperty({
    example: faker.string.alphanumeric(100),
    description: 'Will be valid JWT Encode string',
    required: true,
    nullable: false,
  })
  readonly accessToken: string;

  @ApiProperty({
    example: faker.string.alphanumeric(100),
    description: 'Will be valid JWT Encode string',
    required: true,
    nullable: false,
  })
  readonly refreshToken: string;
}

export class AuthTokenSerialization extends ResponseDefaultSerialization {
  @ApiProperty({
    type: AuthToken,
  })
  data: AuthToken;
}

export class ForgotOtpSerialization extends ResponseDefaultSerialization {
  @ApiProperty({
    description: 'Otp',
    example: '123456',
    type: 'string',
  })
  data: string;
}
