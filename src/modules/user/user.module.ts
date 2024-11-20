import { UserService } from './services/user.service';
import { Module } from '@nestjs/common';
import { UserRepositoryModule } from './repositories/user.repository.module';
import { AuthModule } from 'src/common/auth/auth.module';
import { FileRepository } from '../file/repositories/file.repository';
import { HelperModule } from 'src/common/helper/helper.module';
import { FileRepositoryModule } from '../file/repositories/file.repository.module';

@Module({
  providers: [UserService],
  imports: [
    UserRepositoryModule,
    AuthModule.forRoot(),
    HelperModule,
    FileRepositoryModule,
  ],
  exports: [UserService],
})
export class UserModule {}
