import { Controller, SerializeOptions } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ApiTags } from '@nestjs/swagger';
import { AwsS3Service } from 'src/common/aws/services/aws.s3.service';
import { ADMIN_ONLY_GROUP } from 'src/common/database/constant/serialization-group.constant';
import { DataSource } from 'typeorm';
import { AwsFileService } from '../services/aws.file.service';
import { FileService } from '../services/file.service';

@SerializeOptions({
  groups: ADMIN_ONLY_GROUP,
})
@ApiTags('File Upload')
@Controller('file')
export class FileAdminController {
  constructor(
    private readonly fileService: FileService,
    private connection: DataSource,
  ) {}
}
