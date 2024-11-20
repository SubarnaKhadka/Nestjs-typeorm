import { HttpStatus } from '@nestjs/common';

export enum ENUM_AUTH_STATUS_CODE_ERROR {
  AUTH_JWT_ACCESS_TOKEN_ERROR = HttpStatus.UNAUTHORIZED,
  AUTH_JWT_REFRESH_TOKEN_ERROR = HttpStatus.UNAUTHORIZED,
}
