import { UserModule } from 'src/modules/user/user.module';
import { Module } from '@nestjs/common';
import { AuthenticationModule } from 'src/modules/authentication/authentication.module';
import { AdminAuthController } from 'src/modules/authentication/controllers/authentication.admin.controller';
import { FileAdminController } from 'src/modules/file/controllers/file.admin.controller';
import { FileCommonController } from 'src/modules/file/controllers/file.common.controller';
import { FileModule } from 'src/modules/file/file.module';
import { UserAdminController } from 'src/modules/user/controllers/user.admin.controller';
import { HttpLogsAdminController } from 'src/modules/http-logs/controllers/http-logs.admin.controller';
import { HttpLogsModule } from 'src/modules/http-logs/http-logs.module';
import { BackUpController } from 'src/modules/backup/controllers/backup.controller';
import { BackUpModule } from 'src/modules/backup/backup.module';

@Module({
  controllers: [
    AdminAuthController,
    UserAdminController,
    FileCommonController,
    FileAdminController,
    HttpLogsAdminController,
    BackUpController,
  ],
  imports: [
    AuthenticationModule,
    UserModule,
    FileModule,
    HttpLogsModule,
    BackUpModule,
  ],
})
export class AdminRouterModule {}
