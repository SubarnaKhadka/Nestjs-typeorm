import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ErrorModule } from 'src/common/error/error.module';
import { HelperModule } from 'src/common/helper/helper.module';
import { MessageModule } from 'src/common/message/message.module';
import { PaginationModule } from 'src/common/pagination/pagination.module';
import { RequestModule } from 'src/common/request/request.module';
import { ResponseModule } from 'src/common/response/response.module';
import configs from 'src/configs';
import { AuthModule } from './auth/auth.module';
import { DatabaseModule } from './database/database.module';
import { CustomCacheModule } from './cache/cache.module';

@Module({
  controllers: [],
  providers: [],
  imports: [
    ConfigModule.forRoot({
      load: configs,
      isGlobal: true,
      cache: true,
      envFilePath: ['.env'],
    }),
    AuthModule.forRoot(),
    DatabaseModule,
    MessageModule,
    HelperModule,
    PaginationModule,
    ErrorModule,
    ResponseModule,
    RequestModule,
    CustomCacheModule,
  ],
})
export class CommonModule {}
