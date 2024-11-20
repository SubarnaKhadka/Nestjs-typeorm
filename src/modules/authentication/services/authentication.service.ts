import { AuthService } from 'src/common/auth/services/auth.service';
import {
  BadRequestException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { UserEntity } from 'src/modules/user/entities/user.entity';
import { UserService } from 'src/modules/user/services/user.service';
import {
  EntityManager,
  FindOptionsWhere,
  IsNull,
  MoreThanOrEqual,
  Not,
} from 'typeorm';
import { CustomCacheService } from 'src/common/cache/cache.service';
import { AuthAccessPayloadSerialization } from 'src/common/auth/serializations/auth.access-payload.serialization';
import {
  ENUM_AUTH_LOGIN_FROM,
  ENUM_AUTH_LOGIN_WITH,
} from 'src/common/auth/constants/auth.enum.constant';
import { AuthRefreshPayloadSerialization } from 'src/common/auth/serializations/auth.refresh-payload.serialization';
import { VerifyOtpDto } from '../dtos/verify.dto';
import { OtpEntity } from 'src/modules/otp/entities/otp.entity';
import { OtpService } from 'src/modules/otp/services/otp.service';
import moment from 'moment';
import { OTP_TYPE } from 'src/modules/otp/interfaces/otp.interface';
import { SmsService } from 'src/common/sms/services/sms.service';
import {
  ForgetPasswordDto,
  ForgetPasswordSetDto,
} from '../dtos/forget-password.dto';
import { MailerService } from 'src/common/mailer/services/mailer.service';
import { IAuthToken } from 'src/common/auth/interfaces/auth.interface';
import { AuthToken } from '../serializations/auth.serialization';

@Injectable()
export class AuthenticationService {
  constructor(
    private readonly userService: UserService,
    private readonly authService: AuthService,
    private readonly otpService: OtpService,
    private readonly smsService: SmsService,
    private readonly mailService: MailerService,
    private cacheStorageService: CustomCacheService,
  ) {}

  async getToken(
    user: UserEntity,
    loginWith: ENUM_AUTH_LOGIN_WITH,
    loginFrom: ENUM_AUTH_LOGIN_FROM,
  ): Promise<AuthToken> {
    const tokenType: string = await this.authService.getTokenType();
    const expiresIn: number =
      await this.authService.getAccessTokenExpirationTime();
    const loginDate: Date = await this.authService.getLoginDate();

    const payloadAccessToken: AuthAccessPayloadSerialization =
      await this.authService.createPayloadAccessToken(
        { id: user?.id },
        {
          loginWith,
          loginFrom,
          loginDate,
        },
      );

    const payloadRefreshToken: AuthRefreshPayloadSerialization =
      await this.authService.createPayloadRefreshToken(
        user.id,
        payloadAccessToken,
      );

    const payloadEncryption = await this.authService.getPayloadEncryption();
    let payloadHashedAccessToken: AuthAccessPayloadSerialization | string =
      payloadAccessToken;
    let payloadHashedRefreshToken: AuthRefreshPayloadSerialization | string =
      payloadRefreshToken;

    if (payloadEncryption) {
      payloadHashedAccessToken = await this.authService.encryptAccessToken(
        payloadAccessToken,
      );
      payloadHashedRefreshToken = await this.authService.encryptRefreshToken(
        payloadRefreshToken,
      );
    }

    const accessToken: string = await this.authService.createAccessToken(
      payloadHashedAccessToken,
    );
    const refreshToken: string = await this.authService.createRefreshToken(
      payloadHashedRefreshToken,
    );

    await this.cacheStorageService.removeUser('user', user.id);

    return {
      tokenType,
      expiresIn,
      accessToken,
      refreshToken,
    };
  }

  async handleLogin(
    loginDto: Partial<UserEntity>,
    entityManager?: EntityManager,
  ): Promise<AuthToken> {
    const where: FindOptionsWhere<UserEntity> = {};

    if (loginDto.email) {
      where.email = loginDto.email;
    }

    if (loginDto.phone) {
      where.phone = loginDto.phone;
    }

    const user: UserEntity | null = await this.userService.getOne({
      entityManager,
      options: {
        where,
        withDeleted: true,
        select: {
          password: true,
          id: true,
          isActive: true,
          passwordLastChangedAt: true,
          email: true,
          username: true,
          phone: true,
          phoneVerifiedAt: true,
          emailVerifiedAt: true,
        },
      },
    });
    if (!user) {
      throw new NotFoundException({
        statusCode: HttpStatus.NOT_FOUND,
        message: 'user.error.notFound',
      });
    }

    if (!user?.phoneVerifiedAt && !user?.emailVerifiedAt) {
      throw new BadRequestException({
        statusCode: 411,
        message: 'user.error.notVerified',
      });
    }

    if (!user.isActive) {
      throw new BadRequestException('user.error.inactive');
    }

    const validate: boolean = await this.authService.validateUser(
      loginDto.password,
      user.password,
    );

    if (!validate) {
      const data = await this.cacheStorageService.setData('user', user.id);
      if (data.passwordAttempt >= 10) {
        throw new BadRequestException('user.error.passwordAttemptMax');
      }

      throw new BadRequestException(
        'Invalid credentials, Attempt Left : ' +
          (data.maxPasswordAttempt - data.passwordAttempt),
      );
    }

    return await this.getToken(
      user,
      ENUM_AUTH_LOGIN_WITH.EMAIL,
      ENUM_AUTH_LOGIN_FROM.PASSWORD,
    );
  }

  async handleRegister(
    { email, phone, ...body }: Partial<UserEntity>,
    entityManager?: EntityManager,
  ): Promise<Partial<UserEntity> | null> {
    await this.userService.checkUserExists({
      email,
      phone,
    });

    const data = await this.userService.create(
      {
        ...body,
        email,
        phone,
        registeredAt: new Date(),
      },
      {
        entityManager,
      },
    );

    await this.handleOtpSend(data, OTP_TYPE.REGISTER, entityManager);

    return {
      id: data.id,
    };
  }

  async getUserForRequest(id: number): Promise<UserEntity | null> {
    return await this.userService.getById(id, {
      relations: {
        photos: true,
      },
    });
  }

  async verifyOtp(
    verifyOtpDto: VerifyOtpDto,
    otpType: OTP_TYPE,
    entityManager: EntityManager,
  ) {
    const where: FindOptionsWhere<UserEntity> = {};

    if (verifyOtpDto.email) {
      where.email = verifyOtpDto.email;
    }
    if (verifyOtpDto.phone) {
      where.phone = verifyOtpDto.phone;
    }
    const user: UserEntity | null = await this.userService.getOne({
      options: {
        where,
      },
    });

    if (!user) {
      throw new BadRequestException('user.error.notFound');
    }

    const foundOtp: OtpEntity | null = await this.otpService.getOne({
      options: {
        where: {
          userId: user.id,
          otp: verifyOtpDto.otp,
          expiryDate: MoreThanOrEqual(moment().utc().toDate()),
          otpType: otpType,
        },
      },
    });
    if (!foundOtp) {
      throw new BadRequestException('otp.error.invalid');
    }

    if (moment(foundOtp.expiryDate) < moment()) {
      throw new BadRequestException('otp.error.invalid');
    }
    return { user, foundOtp };
  }

  async verifyRegisterOtp(
    verifyOtpDto: VerifyOtpDto,
    entityManager: EntityManager,
  ): Promise<void> {
    const { user, foundOtp } = await this.verifyOtp(
      verifyOtpDto,
      OTP_TYPE.REGISTER,
      entityManager,
    );

    const updateData: Partial<UserEntity> = {};

    if (verifyOtpDto.phone) {
      updateData.phoneVerifiedAt = new Date();
    }
    if (verifyOtpDto.email) {
      updateData.emailVerifiedAt = new Date();
    }

    await this.userService.update(user, updateData, { entityManager });

    await this.otpService.delete(foundOtp, { entityManager });
  }

  async verifyForgetPasswordOtp(
    verifyOtpDto: ForgetPasswordSetDto,
    entityManager: EntityManager,
  ): Promise<void> {
    const { user, foundOtp } = await this.verifyOtp(
      verifyOtpDto,
      OTP_TYPE.FORGOT_PASSWORD,
      entityManager,
    );
    this.userService.setPassword(
      user,
      {
        password: verifyOtpDto.password,
      },
      {
        entityManager,
      },
    );
    await this.otpService.delete(foundOtp, { entityManager });
  }

  async handleOtpSend(
    user: UserEntity,
    otpType: OTP_TYPE,
    entityManager?: EntityManager,
  ) {
    const otp = this.otpService.generateOtp(6);

    await this.otpService.create(
      {
        userId: user.id,
        otp,
        otpType,
        expiryDate: this.otpService.getTimeAfterMinutes(5),
      },
      {
        entityManager,
      },
    );

    if (user?.phone) {
      this.smsService
        .sendSmsUsingInfobip(
          user?.countryCode + user?.phone,
          `Your (Hamro Event) verification code is: ${otp}`,
        )
        .then(() => {
          console.log('otp.success');
        })
        .catch((e) => {
          console.log(e);
        });
    }

    if (user?.email) {
      this.mailService
        .sendMailUsingInfobip(
          `Forget Password verification`,
          user?.email,
          `Your(Hamro Event) forget password code is: ${otp}`,
        )
        .then(() => {
          console.log('otp.success');
        })
        .catch((e) => {
          console.log(e);
        });
    }
  }

  async getForgetPasswordOtp(data: ForgetPasswordDto) {
    const where: FindOptionsWhere<UserEntity> = {
      isActive: true,
      registeredAt: Not(IsNull()),
    };

    if (data?.email) {
      where.email = data.email;
    }

    if (data?.phone) {
      where.phone = data.phone;
    }

    const user: UserEntity | null = await this.userService.getOne({
      options: {
        where,
      },
    });

    if (!user) {
      throw new BadRequestException('user.error.invalidPhone');
    }

    const otp = this.otpService.generateOtp(6);
    await this.otpService.create({
      userId: user.id,
      otp,
      otpType: OTP_TYPE.FORGOT_PASSWORD,
      expiryDate: this.otpService.getTimeAfterMinutes(5),
    });

    if (data?.phone) {
      this.smsService
        .sendSmsUsingInfobip(
          user?.countryCode + user?.phone,
          `Your(Hamro Event) forget password code is: ${otp}`,
        )
        .then(() => {
          console.log('otp.success');
        })
        .catch((e) => {
          console.log(e);
        });
    }

    if (data?.email) {
      this.mailService
        .sendMailUsingInfobip(
          `Forget Password verification`,
          user?.email,
          `Your(Hamro Event) forget password code is: ${otp}`,
        )
        .then(() => {
          console.log('otp.success');
        })
        .catch((e) => {
          console.log(e);
        });
    }
  }

  async getNewTokenFromRefreshToken(
    refreshToken: string,
    user: UserEntity,
  ): Promise<IAuthToken> {
    const { data } = await this.authService.payloadRefreshToken(refreshToken);

    if (user.passwordLastChangedAt) {
      if (moment(user.passwordLastChangedAt) > moment(data.loginDate)) {
        throw new BadRequestException('user.error.passwordChanged');
      }
    }

    if (!user.isActive) {
      throw new BadRequestException('user.error.inactive');
    }

    const tokenType: string = await this.authService.getTokenType();
    const expiresIn: number =
      await this.authService.getAccessTokenExpirationTime();

    const payloadAccessToken = await this.authService.createPayloadAccessToken(
      { id: user?.id },
      {
        loginDate: data.loginDate,
        loginFrom: data.loginFrom,
        loginWith: data.loginWith,
      },
    );

    const payloadEncryption = await this.authService.getPayloadEncryption();
    let payloadHashedAccessToken: AuthAccessPayloadSerialization | string =
      payloadAccessToken;

    if (payloadEncryption) {
      payloadHashedAccessToken = await this.authService.encryptAccessToken(
        payloadAccessToken,
      );
    }

    const accessToken: string = await this.authService.createAccessToken(
      payloadHashedAccessToken,
    );

    return {
      tokenType,
      expiresIn,
      accessToken,
      refreshToken,
    };
  }
}
