import { Module } from '@nestjs/common';
import { AuthenticationModule } from 'src/modules/authentication/authentication.module';
import { VendorAuthController } from 'src/modules/authentication/controllers/authentication.vendor.controller';
import { FileCommonController } from 'src/modules/file/controllers/file.common.controller';
import { FileVendorController } from 'src/modules/file/controllers/file.vendor.controller';
import { FileModule } from 'src/modules/file/file.module';
import { UserVendorController } from 'src/modules/user/controllers/user.vendor.controller';
import { UserModule } from 'src/modules/user/user.module';

@Module({
  controllers: [
    VendorAuthController,
    UserVendorController,
    FileCommonController,
    FileVendorController,
  ],
  imports: [AuthenticationModule, UserModule, FileModule],
})
export class VendorRouterModule {}
