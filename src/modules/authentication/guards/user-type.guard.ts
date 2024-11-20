import {
  CanActivate,
  ExecutionContext,
  HttpStatus,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { IRequestApp } from 'src/common/request/interfaces/request.interface';
import { UserEntity } from 'src/modules/user/entities/user.entity';
import { USER_TYPE } from 'src/modules/user/interfaces/user.interface';

@Injectable()
export class UserTypeGuard implements CanActivate {
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request: IRequestApp & { __user: any } = context
      .switchToHttp()
      .getRequest<IRequestApp & { __user: any }>();
    const __user: UserEntity = request.__user;

    if (!__user) {
      throw new UnauthorizedException({
        statusCode: HttpStatus.UNAUTHORIZED,
        message: 'Not Authorized!',
      });
    }
    const url = request.url;

    const currentContext = url.split('/').filter((item) => item !== '')[2];

    switch (__user.type) {
      case USER_TYPE.ADMIN: {
        if (currentContext !== 'admin') {
          throw new NotFoundException({
            statusCode: HttpStatus.FORBIDDEN,
            message: 'User not permitted',
          });
        }
        break;
      }
      case USER_TYPE.CUSTOMER: {
        if (currentContext !== 'customer') {
          throw new NotFoundException({
            statusCode: HttpStatus.FORBIDDEN,
            message: 'User not permitted',
          });
        }
        break;
      }
      case USER_TYPE.VENDOR: {
        if (currentContext !== 'vendor') {
          throw new NotFoundException({
            statusCode: HttpStatus.FORBIDDEN,
            message: 'User not permitted',
          });
        }
        break;
      }
      default: {
        throw new NotFoundException({
          statusCode: HttpStatus.FORBIDDEN,
          message: 'User not permitted',
        });
      }
    }

    return true;
  }
}
