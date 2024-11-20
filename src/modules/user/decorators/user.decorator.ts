import {
  applyDecorators,
  createParamDecorator,
  ExecutionContext,
  UseGuards,
} from '@nestjs/common';
import { IRequestApp } from 'src/common/request/interfaces/request.interface';
import { UserEntity } from '../entities/user.entity';
import { AuthJwtRefreshGuard } from 'src/common/auth/guards/jwt-refresh/auth.jwt-refresh.guard';
import { AuthJwtAccessGuard } from 'src/common/auth/guards/jwt-access/auth.jwt-access.guard';
import { UserTypeGuard } from 'src/modules/authentication/guards/user-type.guard';
import { UserPutToRequestGuard } from 'src/modules/authentication/guards/user-put-to-request.guard';

export const GetUser = createParamDecorator(
  (returnPlain: boolean, ctx: ExecutionContext): UserEntity => {
    const req = ctx
      .switchToHttp()
      .getRequest<IRequestApp & { __user: UserEntity }>();
    return returnPlain ? req.__user : req.__user;
  },
);

export function UserProtected(options?: {
  isRefresh?: boolean;
  addRole?: boolean;
}): MethodDecorator {
  const decorators: any[] = [
    options?.isRefresh ? AuthJwtRefreshGuard : AuthJwtAccessGuard,
    UserPutToRequestGuard,
    UserTypeGuard,
  ];
  return applyDecorators(UseGuards(...decorators));
}
