import { ApiProperty, PartialType, PickType } from '@nestjs/swagger';
import { UserCreateDto } from './user.create.dto';
import { faker } from '@faker-js/faker';

export class UpdateUserProfileDto extends PartialType(
  PickType(UserCreateDto, ['name', 'dob', 'email', 'gender', 'phone'] as const),
) {
  @ApiProperty({
    type: 'string',
    example: faker.internet.userName(),
    required: false,
  })
  username?: string;

  @ApiProperty({
    type: 'number',
    example: faker.number.int(),
    required: false,
  })
  profilePictureId?: number;
}
