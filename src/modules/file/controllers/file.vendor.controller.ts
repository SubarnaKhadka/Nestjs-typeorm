import { Controller, SerializeOptions } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { VENDOR_ONLY_GROUP } from 'src/common/database/constant/serialization-group.constant';
import { DataSource } from 'typeorm';
import { FileService } from '../services/file.service';

@SerializeOptions({
  groups: VENDOR_ONLY_GROUP,
})
@ApiTags('File Upload')
@Controller('file')
export class FileVendorController {
  constructor(
    private readonly fileService: FileService,
    private connection: DataSource,
  ) {}
}
