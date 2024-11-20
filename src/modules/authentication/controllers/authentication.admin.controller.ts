import {
  BadRequestException,
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  SerializeOptions,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { ADMIN_ONLY_GROUP } from 'src/common/database/constant/serialization-group.constant';
import { DataSource, QueryRunner } from 'typeorm';
import { AuthenticationService } from '../services/authentication.service';
import { ApiDocs } from 'src/common/doc/common-docs';
import { AuthTokenSerialization } from '../serializations/auth.serialization';
import { AdminLoginDto, LoginDto } from '../dtos/login.dto';
import {
  GetUser,
  UserProtected,
} from 'src/modules/user/decorators/user.decorator';
import { ResponseMessage } from 'src/common/response/decorators/responseMessage.decorator';
import { AuthJwtToken } from 'src/common/auth/decorators/auth.jwt.decorator';
import { UserEntity } from 'src/modules/user/entities/user.entity';
import { UserProfileSerialization, UserSerialization } from 'src/modules/user/serializations/user.serialization';

@SerializeOptions({
  groups: ADMIN_ONLY_GROUP,
})
@ApiTags('Authentication')
@Controller('auth')
export class AdminAuthController {
  constructor(
    private connection: DataSource,
    private readonly authenticationService: AuthenticationService,
  ) {}

  @ApiDocs({
    operation: 'Login',
    description:
      'Log in a admin using their registered phone number or email and password to receive an authentication token.',
    serialization: AuthTokenSerialization,
    jwtAccessToken: false,
  })
  @ResponseMessage('user.login')
  @HttpCode(HttpStatus.OK)
  @Post('/login')
  async login(@Body() body: AdminLoginDto) {
    const queryRunner: QueryRunner = this.connection.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      const data = await this.authenticationService.handleLogin(
        body,
        queryRunner.manager,
      );
      await queryRunner.commitTransaction();
      return { data };
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
    }
  }

  @ApiDocs({
    operation: 'refresh-token',
    serialization: AuthTokenSerialization,
    description:
      'Use this endpoint to get a new access token using a valid refresh token.',
    jwtRefreshToken: true,
    jwtAccessToken: false,
  })
  @UserProtected({ isRefresh: true })
  @ResponseMessage('user.refresh')
  @HttpCode(HttpStatus.OK)
  @Post('/refresh-token')
  async refreshRenew(
    @GetUser() user: UserEntity,
    @AuthJwtToken() refreshToken?: string,
  ) {
    const queryRunner: QueryRunner = this.connection.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      if (!refreshToken) {
        throw new BadRequestException('request.error.invalid');
      }

      const data = await this.authenticationService.getNewTokenFromRefreshToken(
        refreshToken,
        user,
      );
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
    operation: 'Get information of logged in user',
    serialization: UserSerialization,
    description: 'Retrieve the profile information of the authenticated user.',
  })
  @ResponseMessage('user.get')
  @Get('/me')
  async me(@GetUser() user: UserEntity): Promise<{ data: UserEntity }> {
    return { data: user };
  }
}
