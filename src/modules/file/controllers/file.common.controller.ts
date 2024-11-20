import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  InternalServerErrorException,
  NotFoundException,
  Param,
  Post,
  SerializeOptions,
  UploadedFile,
  UploadedFiles,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { ALL_GROUP } from 'src/common/database/constant/serialization-group.constant';
import { ApiDocs } from 'src/common/doc/common-docs';
import { ENUM_DOC_REQUEST_BODY_TYPE } from 'src/common/doc/interfaces/doc.interface';
import { ENUM_ERROR_STATUS_CODE_ERROR } from 'src/common/error/constants/error.status-code.constant';
import { IFile } from 'src/common/file/interfaces/file.interface';
import { FileRequiredPipe } from 'src/common/file/pipes/file.required.pipe';
import { FileSizeImagePipe } from 'src/common/file/pipes/file.size.pipe';
import { FileTypeImagePipe } from 'src/common/file/pipes/file.type.pipe';
import { DataSource, QueryRunner } from 'typeorm';
import { FileUploadDTO, FilesUploadDTO } from '../dto/create.file.dto';
import { AwsFileService } from '../services/aws.file.service';
import { FileService } from '../services/file.service';
import { RequestParamGuard } from 'src/common/request/decorators/request.decorator';
import { IdParamDto } from 'src/common/dto/id-param.dto';
import { FileSerialization } from '../serializations/file.serialization';
import { FileEntity } from '../entities/file.entity';
import { ResponseMessage } from 'src/common/response/decorators/responseMessage.decorator';
import { CustomResponseDecorator } from 'src/common/auth/decorators/custom.response.decorators';
import {
  FileUploadMultiple,
  FileUploadSingle,
} from 'src/common/file/decorators/file.decorator';
import {
  GetUser,
  UserProtected,
} from 'src/modules/user/decorators/user.decorator';

@SerializeOptions({
  groups: ALL_GROUP,
})
@ApiTags('File Upload')
@Controller('file')
export class FileCommonController {
  constructor(
    private readonly fileService: FileService,
    private connection: DataSource,
  ) {}

  @ApiDocs({
    bodyType: ENUM_DOC_REQUEST_BODY_TYPE.FORM_DATA,
    operation: 'Upload image',
  })
  @UserProtected()
  @FileUploadSingle('file')
  @HttpCode(HttpStatus.OK)
  @ResponseMessage('file.imageUpload')
  @Post('/image/upload')
  async upload(
    @Body() body: FileUploadDTO,
    @UploadedFile(FileRequiredPipe, FileSizeImagePipe, FileTypeImagePipe)
    file: IFile,
    @GetUser() __user,
  ): Promise<any> {
    const queryRunner: QueryRunner = this.connection.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const result = await this.fileService.addFile(
        body,
        file,
        __user,
        queryRunner.manager,
      );

      await queryRunner.commitTransaction();

      return { data: result };
    } catch (err: any) {
      await queryRunner.rollbackTransaction();
      throw new InternalServerErrorException({
        statusCode: ENUM_ERROR_STATUS_CODE_ERROR.ERROR_UNKNOWN,
        message: 'Internal Server Error',
      });
    } finally {
      await queryRunner.release();
    }
  }

  @ApiDocs({
    bodyType: ENUM_DOC_REQUEST_BODY_TYPE.FORM_DATA,
    operation: 'Upload file',
  })
  @UserProtected()
  @FileUploadSingle('file')
  @HttpCode(HttpStatus.OK)
  @ResponseMessage('file.fileUpload')
  @Post('/other/upload')
  async uploadFile(
    @Body() body: FileUploadDTO,
    @UploadedFile(FileRequiredPipe, FileSizeImagePipe)
    file: IFile,
    @GetUser() __user,
  ): Promise<any> {
    const queryRunner: QueryRunner = this.connection.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const result = await this.fileService.addFile(
        body,
        file,
        __user,
        queryRunner.manager,
      );

      await queryRunner.commitTransaction();

      return { data: result };
    } catch (err: any) {
      await queryRunner.rollbackTransaction();
      throw new InternalServerErrorException({
        statusCode: ENUM_ERROR_STATUS_CODE_ERROR.ERROR_UNKNOWN,
        message: 'Internal Server Error',
      });
    } finally {
      await queryRunner.release();
    }
  }

  @ApiDocs({
    bodyType: ENUM_DOC_REQUEST_BODY_TYPE.FORM_DATA,
    operation: 'Upload multiple image',
  })
  @UserProtected()
  @FileUploadMultiple('files')
  @ResponseMessage('file.multipleImageUpload')
  @HttpCode(HttpStatus.OK)
  @Post('/image/uploads')
  async uploadArray(
    @Body() body: FilesUploadDTO,
    @UploadedFiles(FileRequiredPipe, FileSizeImagePipe, FileTypeImagePipe)
    files: IFile[],
    @GetUser() __user,
  ): Promise<any> {
    const queryRunner: QueryRunner = this.connection.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const result = await Promise.all(
        files.map((file) =>
          this.fileService.addFile(body, file, __user, queryRunner.manager),
        ),
      );

      await queryRunner.commitTransaction();

      return { data: result };
    } catch (err: any) {
      await queryRunner.rollbackTransaction();
      throw new InternalServerErrorException({
        statusCode: ENUM_ERROR_STATUS_CODE_ERROR.ERROR_UNKNOWN,
        message: 'Internal Server Error',
      });
    } finally {
      await queryRunner.release();
    }
  }

  @ApiDocs({
    bodyType: ENUM_DOC_REQUEST_BODY_TYPE.FORM_DATA,
    operation: 'Upload files',
  })
  @UserProtected()
  @FileUploadMultiple('files')
  @ResponseMessage('Files uploaded successfully')
  @HttpCode(HttpStatus.OK)
  @Post('/other/uploads')
  async uploadFileArray(
    @Body() body: FilesUploadDTO,
    @UploadedFiles(FileRequiredPipe, FileSizeImagePipe)
    files: IFile[],
    @GetUser() __user,
  ): Promise<any> {
    const queryRunner: QueryRunner = this.connection.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const result = await Promise.all(
        files.map((file) =>
          this.fileService.addFile(body, file, __user, queryRunner.manager),
        ),
      );

      await queryRunner.commitTransaction();

      return { data: result };
    } catch (err: any) {
      await queryRunner.rollbackTransaction();
      throw new InternalServerErrorException({
        statusCode: ENUM_ERROR_STATUS_CODE_ERROR.ERROR_UNKNOWN,
        message: 'Internal Server Error',
      });
    } finally {
      await queryRunner.release();
    }
  }

  @UserProtected()
  @ApiDocs({
    operation: 'Get File by id',
    params: [
      {
        name: 'id',
        required: true,
        type: 'number',
      },
    ],
    serialization: FileSerialization,
  })
  @RequestParamGuard(IdParamDto)
  @ResponseMessage('file.get')
  @Get('/info/:id')
  async getImageById(
    @Param() { id }: IdParamDto,
  ): Promise<{ data: FileEntity }> {
    const file = await this.fileService.getById(id);
    if (!file) {
      throw new NotFoundException('file.error.notFound');
    }
    return { data: file };
  }

  @UserProtected()
  @ApiDocs({
    operation: 'Delete File by id',
    params: [
      {
        name: 'id',
        required: true,
        type: 'number',
      },
    ],
    serialization: FileSerialization,
  })
  @CustomResponseDecorator(['id'])
  @RequestParamGuard(IdParamDto)
  @ResponseMessage('file.delete')
  @Delete('/delete/:id')
  async deleteImageById(
    @Param() { id }: IdParamDto,
  ): Promise<{ data: FileEntity }> {
    const file = await this.fileService.getById(id);
    if (!file) {
      throw new NotFoundException('file.error.notFound');
    }
    if (file.associationId || file.associationType) {
      throw new BadRequestException('file.error.deleteOtherAssociatedFile');
    }
    await this.fileService.softDelete(file);
    return { data: file };
  }
}
