import { Body, Controller, Patch, SerializeOptions } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { UserService } from '../services/user.service';
import { ADMIN_ONLY_GROUP } from 'src/common/database/constant/serialization-group.constant';
import { GetUser, UserProtected } from '../decorators/user.decorator';
import { ApiDocs, DocDefault } from 'src/common/doc/common-docs';
import {
  UserSerialization,
} from '../serializations/user.serialization';
import { IResponse } from 'src/common/response/interfaces/response.interface';
import { UserEntity } from '../entities/user.entity';
import { ResponseMessage } from 'src/common/response/decorators/responseMessage.decorator';
import { UpdateUserProfileDto } from '../dtos/user.update.dto';
import { ChangePasswordDto } from '../dtos/change.password.dto';
import { DataSource, QueryRunner } from 'typeorm';
import { ResponseDefaultSerialization } from 'src/common/doc/serializations/response.default.serialization';

@SerializeOptions({
  groups: ADMIN_ONLY_GROUP,
})
@ApiTags('User')
@Controller('user')
export class UserAdminController {
  constructor(
    private readonly connection: DataSource,
    private readonly userService: UserService,
  ) {}

  @UserProtected()
  @ApiDocs({
    operation: 'Update own profile',
    serialization: UserSerialization,
    description:
      'Allows authenticated users to update their profile information.',
  })
  @ResponseMessage('user.updateProfile')
  @Patch('/update-profile')
  async updateProfile(
    @Body() updateData: UpdateUserProfileDto,
    @GetUser() user: UserEntity,
  ): Promise<IResponse<UserEntity>> {
    const queryRunner: QueryRunner = this.connection.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      const data = await this.userService.update(user, updateData, {
        entityManager: queryRunner.manager,
      });
      await queryRunner.commitTransaction();
      return { data };
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
    }
  }

  @UserProtected()
  @ApiDocs({
    operation: 'Change Password',
    serialization: ResponseDefaultSerialization,
    description:
      'Allows authenticated users to change their account password by providing the old password and a new password',
  })
  @DocDefault({
    statusCode: 400,
    message: 'Old Password didnot Match',
  })
  @ResponseMessage('user.changePassword')
  @Patch('/change-password')
  async changePassword(
    @Body() updatedData: ChangePasswordDto,
    @GetUser() user: UserEntity,
  ) {
    const queryRunner: QueryRunner = this.connection.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      await this.userService.changePassword(user, updatedData);
      await queryRunner.commitTransaction();
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
    }
  }
}
