import {
  applyDecorators,
  createParamDecorator,
  ExecutionContext,
  UseGuards,
} from '@nestjs/common';
import { AuthJwtAccessGuard } from 'src/common/auth/guards/jwt-access/auth.jwt-access.guard';
import { AuthJwtRefreshGuard } from 'src/common/auth/guards/jwt-refresh/auth.jwt-refresh.guard';
import { IRequestApp } from 'src/common/request/interfaces/request.interface';

export const AuthJwtPayload = createParamDecorator(
  <T>(data: string, ctx: ExecutionContext): T => {
    const { user } = ctx.switchToHttp().getRequest<IRequestApp & { user: T }>();
    return data ? user[data] : user;
  },
);

export const AuthJwtToken = createParamDecorator(
  (data: string, ctx: ExecutionContext): string => {
    const { headers } = ctx.switchToHttp().getRequest<IRequestApp>();
    const { authorization } = headers;

    console.log(authorization);
    const authorizations: string[] = authorization.split(' ');

    return authorizations.length >= 2 ? authorizations[1] : undefined;
  },
);

export function AuthJwtAccessProtected(): MethodDecorator {
  return applyDecorators(UseGuards(AuthJwtAccessGuard));
}

export function AuthJwtUserAccessProtected(): MethodDecorator {
  return applyDecorators(UseGuards(AuthJwtAccessGuard));
}

export function AuthJwtAdminAccessProtected(): MethodDecorator {
  return applyDecorators(UseGuards(AuthJwtAccessGuard));
}

export function AuthJwtRefreshProtected(): MethodDecorator {
  return applyDecorators(UseGuards(AuthJwtRefreshGuard));
}
