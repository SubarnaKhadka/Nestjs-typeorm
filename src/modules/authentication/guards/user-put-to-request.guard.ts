import {
  CanActivate,
  ExecutionContext,
  HttpStatus,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { IRequestApp } from 'src/common/request/interfaces/request.interface';
import { AuthenticationService } from '../services/authentication.service';

@Injectable()
export class UserPutToRequestGuard implements CanActivate {
  constructor(private authService: AuthenticationService) {}
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context
      .switchToHttp()
      .getRequest<IRequestApp & { __user: any }>();

    const { user }: any = request?.user;
    if (!user || !user?.id) {
      throw new UnauthorizedException({
        statusCode: HttpStatus.UNAUTHORIZED,
        message: 'Not Authorized!',
      });
    }
    const userFromDb = await this.authService.getUserForRequest(user.id);

    if (!userFromDb) {
      throw new UnauthorizedException({
        statusCode: HttpStatus.UNAUTHORIZED,
        message: 'Not Authorized!',
      });
    }
    request['__user'] = userFromDb;
    
    return true;
  }
}
