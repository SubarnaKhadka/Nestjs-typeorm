import { Module } from '@nestjs/common';
import { AwsFileService } from './services/aws.file.service';
import { FileService } from './services/file.service';
import { HelperModule } from 'src/common/helper/helper.module';
import { FileRepositoryModule } from './repositories/file.repository.module';
import { AwsModule } from 'src/common/aws/aws.module';

@Module({
  imports: [HelperModule, FileRepositoryModule, AwsModule],
  providers: [FileService, AwsFileService],
  exports: [FileService, AwsFileService],
})
export class FileModule {}
