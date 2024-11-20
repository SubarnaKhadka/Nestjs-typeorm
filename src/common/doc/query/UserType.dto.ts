import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsEnum, IsOptional } from 'class-validator';
import { USER_TYPE } from 'src/modules/user/interfaces/user.interface';

export class UserTypeDto {
  @ApiPropertyOptional({ enum: USER_TYPE, required: false })
  @IsOptional()
  @IsEnum(USER_TYPE)
  type?: USER_TYPE;
}
