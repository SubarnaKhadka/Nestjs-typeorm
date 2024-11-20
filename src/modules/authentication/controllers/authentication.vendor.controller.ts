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
import { IResponse } from 'src/common/response/interfaces/response.interface';
import { DataSource, QueryRunner } from 'typeorm';
import { AuthenticationService } from 'src/modules/authentication/services/authentication.service';
import { UserCreateDto } from 'src/modules/user/dtos/user.create.dto';
import { LoginDto } from '../dtos/login.dto';
import { USER_TYPE } from 'src/modules/user/interfaces/user.interface';
import { ApiDocs, DocDefault } from 'src/common/doc/common-docs';
import { AuthTokenSerialization } from '../serializations/auth.serialization';
import { ResponseMessage } from 'src/common/response/decorators/responseMessage.decorator';
import { VerifyOtpDto } from '../dtos/verify.dto';
import {
    ForgetPasswordDto,
    ForgetPasswordSetDto,
} from '../dtos/forget-password.dto';
import {
    GetUser,
    UserProtected,
} from 'src/modules/user/decorators/user.decorator';
import { AuthJwtToken } from 'src/common/auth/decorators/auth.jwt.decorator';
import { UserEntity } from 'src/modules/user/entities/user.entity';
import {
    UserProfileSerialization,
} from 'src/modules/user/serializations/user.serialization';
import { VENDOR_ONLY_GROUP } from 'src/common/database/constant/serialization-group.constant';
import { ResponseIdDefaultSerialization } from 'src/common/response/serializations/response.id.serialization';
import { ResponseDefaultSerialization } from 'src/common/doc/serializations/response.default.serialization';

@SerializeOptions({
    groups: VENDOR_ONLY_GROUP,
})
@ApiTags('Authentication')
@Controller('auth')
export class VendorAuthController {
    constructor(
        private connection: DataSource,
        private readonly authenticationService: AuthenticationService,
    ) { }

    @ApiDocs({
        operation: 'Register new user',
        serialization: ResponseIdDefaultSerialization,
        description:
            'This endpoint allows customers to register with a unique phone number, email, or both. An OTP is sent to the provided email or phone upon successful registration for verification.',
        jwtAccessToken: false,
    })
    @DocDefault({
        statusCode: 400,
        message: 'Phone already exists',
    })
    @ResponseMessage('user.create')
    @Post('/register')
    async create(@Body() userDto: UserCreateDto): Promise<IResponse> {
        const queryRunner: QueryRunner = this.connection.createQueryRunner();
        await queryRunner.connect();
        await queryRunner.startTransaction();
        try {
            const data = await this.authenticationService.handleRegister(
                { ...userDto, type: USER_TYPE.CUSTOMER },
                queryRunner.manager,
            );
            await queryRunner.commitTransaction();
            return { data: { id: data.id } };
        } catch (error) {
            await queryRunner.rollbackTransaction();
            throw error;
        } finally {
            await queryRunner.release();
        }
    }

    @ApiDocs({
        operation: 'Verify auth otp',
        serialization: ResponseDefaultSerialization,
        description:
            'Verify the OTP sent to the registered phone number or email for authentication.',
        jwtAccessToken: false,
    })
    @DocDefault({
        statusCode: 400,
        message: 'Invalid otp',
    })
    @ResponseMessage('otp.verifyOtp')
    @HttpCode(HttpStatus.OK)
    @Post('verify-auth-otp')
    async verifyAuthOtp(@Body() body: VerifyOtpDto) {
        const queryRunner: QueryRunner = this.connection.createQueryRunner();
        await queryRunner.connect();
        await queryRunner.startTransaction();
        try {
            const data = await this.authenticationService.verifyRegisterOtp(
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
        operation: 'Login',
        description:
            'Log in a vendor using their registered phone number or email and password to receive an authentication token.',
        serialization: AuthTokenSerialization,
        jwtAccessToken: false,
    })
    @DocDefault({
        statusCode: 411,
        message: 'User is not verified',
    })
    @ResponseMessage('user.login')
    @HttpCode(HttpStatus.OK)
    @Post('/login')
    async login(@Body() body: LoginDto) {
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
                throw new BadRequestException('Invalid request');
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

    @ApiDocs({
        operation: 'Forget Password',
        serialization: ResponseDefaultSerialization,
        description:
            'Initiate a password reset by sending a otp to the registered email or phone number.',
        jwtAccessToken: false,
    })
    @HttpCode(HttpStatus.OK)
    @ResponseMessage('user.passwordForgot')
    @Post('/forget-password')
    async forgetPassword(@Body() body: ForgetPasswordDto): Promise<void> {
        await this.authenticationService.getForgetPasswordOtp(body);
    }

    @ApiDocs({
        operation: 'Forget Password Reset',
        serialization: ResponseDefaultSerialization,
        description: 'Set a new password using a valid reset otp',
        jwtAccessToken: false,
    })
    @DocDefault({
        statusCode: 400,
        message: 'Invalid otp',
    })
    @ResponseMessage('user.passwordForgetSet')
    @HttpCode(HttpStatus.OK)
    @Post('/forget-password-set')
    async forgetPasswordSet(@Body() body: ForgetPasswordSetDto) {
        const queryRunner: QueryRunner = this.connection.createQueryRunner();
        await queryRunner.connect();
        await queryRunner.startTransaction();
        try {
            const data = await this.authenticationService.verifyForgetPasswordOtp(
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

    @UserProtected()
    @ApiDocs({
        operation: 'Get information of logged in user',
        serialization: UserProfileSerialization,
        description: 'Retrieve the profile information of the authenticated user.',
    })
    @ResponseMessage('user.get')
    @Get('/me')
    async me(@GetUser() user: UserEntity): Promise<{ data: UserEntity }> {
        return { data: user };
    }
}
