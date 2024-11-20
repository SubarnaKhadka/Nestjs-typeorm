import { Module } from '@nestjs/common';
import { AuthenticationModule } from 'src/modules/authentication/authentication.module';
import { CustomerAuthController } from 'src/modules/authentication/controllers/authentication.customer.controller';
import { FileCommonController } from 'src/modules/file/controllers/file.common.controller';
import { FileCustomerController } from 'src/modules/file/controllers/file.customer.controller';
import { FileModule } from 'src/modules/file/file.module';
import { UserCustomerController } from 'src/modules/user/controllers/user.customer.controller';
import { UserModule } from 'src/modules/user/user.module';

@Module({
  controllers: [
    CustomerAuthController,
    UserCustomerController,
    FileCommonController,
    FileCustomerController,
  ],
  imports: [AuthenticationModule, FileModule, UserModule],
})
export class CustomerRouterModule {}
