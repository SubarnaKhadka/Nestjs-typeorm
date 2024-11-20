import { ApiProperty } from '@nestjs/swagger';
import { UPLOAD_FOLDER_ENUM } from '../constants/upload.folder.enum.list';
import { IsEnum, IsNotEmpty, IsString } from 'class-validator';

export class FileArrayDto {
  @ApiProperty({ type: 'string', format: 'binary' })
  file: any;
}

export class FileUploadDTO {
  @ApiProperty({ type: 'string', enum: UPLOAD_FOLDER_ENUM })
  @IsEnum(UPLOAD_FOLDER_ENUM)
  @IsNotEmpty()
  @IsString()
  folder: string;

  @ApiProperty({
    type: 'string',
    format: 'binary',
  })
  file: any;
}
export class FilesUploadDTO {
  @ApiProperty({ type: 'string', enum: UPLOAD_FOLDER_ENUM })
  @IsEnum(UPLOAD_FOLDER_ENUM)
  @IsNotEmpty()
  @IsString()
  folder: string;

  @ApiProperty({
    type: 'array',
    items: {
      type: 'string',
      format: 'binary',
    },
    description: 'File uploads, max file count 20',
  })
  files: any;
}
