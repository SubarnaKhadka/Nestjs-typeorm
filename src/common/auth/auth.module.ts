import { DynamicModule, Module } from '@nestjs/common';
import { AuthJwtAccessStrategy } from 'src/common/auth/guards/jwt-access/auth.jwt-access.strategy';
import { AuthJwtRefreshStrategy } from 'src/common/auth/guards/jwt-refresh/auth.jwt-refresh.strategy';
import { AuthService } from 'src/common/auth/services/auth.service';
import { HelperModule } from '../helper/helper.module';

@Module({
  providers: [AuthService],
  exports: [AuthService],
  controllers: [],
  imports: [HelperModule],
})
export class AuthModule {
  static forRoot(): DynamicModule {
    return {
      module: AuthModule,
      providers: [AuthJwtAccessStrategy, AuthJwtRefreshStrategy],
      exports: [],
      controllers: [],
      imports: [],
    };
  }
}
