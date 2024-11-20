import { Module } from '@nestjs/common';
import { CommonModule } from 'src/common/common.module';
import { RouterModule } from 'src/router/router.module';
import { join } from 'path';
import { ServeStaticModule } from '@nestjs/serve-static';


@Module({
  imports: [
    CommonModule,
    RouterModule,
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'assets'),
      serveRoot: '/assets/',
    }),
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
