import {
  ENUM_AUTH_LOGIN_FROM,
  ENUM_AUTH_LOGIN_WITH,
} from 'src/common/auth/constants/auth.enum.constant';

// Auth
export interface IAuthPassword {
  salt: string;
  passwordHash: string;
  passwordExpired: Date;
  passwordCreated: Date;
}

export interface IAuthPayloadOptions {
  loginWith: ENUM_AUTH_LOGIN_WITH;
  loginFrom: ENUM_AUTH_LOGIN_FROM;
  loginDate: Date;
}

export interface IAuthToken {
  tokenType: string,
  expiresIn: number,
  accessToken: string,
  refreshToken: string,
}