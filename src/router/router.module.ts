import { Module } from '@nestjs/common';
import { RouterModule as NestJsRouterModule } from '@nestjs/core';
import { AdminRouterModule } from './routes/admin.router.module';
import { CustomerRouterModule } from './routes/customer.router.module';
import { VendorRouterModule } from './routes/vendor.router.module';

@Module({
  imports: [
    AdminRouterModule,
    CustomerRouterModule,
    VendorRouterModule,
    NestJsRouterModule.register([
      {
        path: 'admin',
        module: AdminRouterModule,
      },
      {
        path: 'customer',
        module: CustomerRouterModule,
      },
      {
        path: 'vendor',
        module: VendorRouterModule,
      },
    ]),
  ],
})
export class RouterModule {}
