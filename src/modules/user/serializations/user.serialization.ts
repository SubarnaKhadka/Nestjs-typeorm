import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  ResponseDefaultSerialization,
  ResponsePaginationDefaultSerialization,
} from 'src/common/doc/serializations/response.default.serialization';
import { UserEntity, UserNameJson } from '../entities/user.entity';
import { USER_GENDER, USER_TYPE } from '../interfaces/user.interface';
import { faker } from '@faker-js/faker';
import { FileEntity } from 'src/modules/file/entities/file.entity';
import { FileSingleDto } from 'src/common/file/dtos/file.single.dto';
import { FileUploadDTO } from 'src/modules/file/dto/create.file.dto';
import { BasePhoto } from 'src/modules/file/dto/base.file.photo';

export class ProfileSerialization {
  @ApiProperty({ example: '120', type: 'number' })
  id: number;

  @ApiPropertyOptional({
    example: '2023-05-20T12:34:56.789Z',
    type: 'timestamptz',
  })
  updatedAt: Date;

  @ApiProperty({
    example: faker.internet.email(),
    description: 'The User Email',
    required: false,
  })
  email: string;

  @ApiProperty({
    example: faker.internet.userName(),
    description: 'The User UserName',
    required: false,
  })
  username: string;

  @ApiProperty({
    example: '9812345678',
    description: 'The User Phone number',
    required: false,
  })
  phone: string;

  @ApiProperty({ example: UserNameJson })
  name: UserNameJson;

  @ApiPropertyOptional({ example: faker.date.anytime() })
  emailVerifiedAt: Date;

  @ApiPropertyOptional({ example: faker.date.anytime() })
  phoneVerifiedAt: Date;

  @ApiPropertyOptional({ example: '+977' })
  countryCode: string;

  @ApiPropertyOptional({ example: true })
  isActive: boolean;

  @ApiPropertyOptional({ example: faker.date.anytime() })
  registeredAt: Date;

  @ApiPropertyOptional({ example: USER_TYPE.CUSTOMER })
  type: USER_TYPE;

  @ApiProperty({ example: USER_GENDER.MALE })
  gender: USER_GENDER;

  @ApiPropertyOptional({ example: '2000-01-01' })
  dob: Date;

  @ApiPropertyOptional({ type: BasePhoto })
  profilePicture?: BasePhoto;
}

export class UserProfileSerialization extends ResponseDefaultSerialization {
  @ApiProperty({
    type: ProfileSerialization,
  })
  data: ProfileSerialization;
}

export class UserSerialization extends ResponseDefaultSerialization {
  @ApiProperty({
    type: UserEntity,
  })
  data: UserEntity;
}

export class UserPaginationSerialization extends ResponsePaginationDefaultSerialization {
  @ApiProperty({
    type: [UserEntity],
  })
  data: UserEntity;
}
