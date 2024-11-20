import { BadRequestException, Injectable } from '@nestjs/common';
import { v4 as uuidv4 } from 'uuid';
import { UPLOAD_FOLDER_ENUM } from '../constants/upload.folder.enum.list';
import { FileUploadDTO, FilesUploadDTO } from '../dto/create.file.dto';

@Injectable()
export class AwsFileService {
  async createPhotoFilename(path): Promise<Record<string, any>> {
    const filename: string = this.random(20);

    return {
      path: path,
      filename: filename,
    };
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  random(length: number = 10, options?): string {
    const uuid = uuidv4();
    const uniqueString = uuid.replace(/-/g, '');
    return uniqueString;
  }

  getPath(user, body: FileUploadDTO | FilesUploadDTO): string {
    let path: string;
    switch (body.folder) {
      case UPLOAD_FOLDER_ENUM.USER:
        path = `${UPLOAD_FOLDER_ENUM.USER}`;
        break;
      default:
        throw new BadRequestException('file.error.invalidFolder');
    }
    return path;
  }
}
