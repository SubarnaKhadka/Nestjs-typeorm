import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AwsS3Serialization } from 'src/common/aws/serializations/aws.s3.serialization';
import { AwsS3Service } from 'src/common/aws/services/aws.s3.service';
import { ICreateOptions } from 'src/common/database/interfaces/createOption.interface';
import { IDeleteOptions } from 'src/common/database/interfaces/deleteOption.interface';
import {
  IFindAllOptions,
  IFindOneOptions,
  IPaginateFindOption,
  IPaginateQueryBuilderOption,
} from 'src/common/database/interfaces/findOption.interface';
import {
  IUpdateOptions,
  IUpdateRawOptions,
} from 'src/common/database/interfaces/updateOption.interface';
import { ENUM_ERROR_STATUS_CODE_ERROR } from 'src/common/error/constants/error.status-code.constant';
import { IFile } from 'src/common/file/interfaces/file.interface';
import { IPaginationMeta } from 'src/common/response/interfaces/response.interface';
import { UserEntity } from 'src/modules/user/entities/user.entity';
import { DeepPartial, EntityManager, UpdateResult } from 'typeorm';
import { QueryDeepPartialEntity } from 'typeorm/query-builder/QueryPartialEntity';
import { FILE_ASSOCIATION_TYPE } from '../constants/association-type.enum';
import { BasePhoto } from '../dto/base.file.photo';
import { FileUploadDTO, FilesUploadDTO } from '../dto/create.file.dto';
import { FileEntity } from '../entities/file.entity';
import { IFileInterface } from '../interfaces/file.interfaces';
import { FileRepository } from '../repositories/file.repository';
import { AwsFileService } from './aws.file.service';

@Injectable()
export class FileService {
  constructor(
    private readonly fileRepo: FileRepository,
    private readonly awsService: AwsS3Service,
    private readonly configService: ConfigService,
    private readonly awsFileService: AwsFileService,
  ) {}

  async create(
    createDto: DeepPartial<FileEntity>,
    options?: ICreateOptions,
  ): Promise<FileEntity> {
    const data = await this.fileRepo._create(createDto, options);
    return data;
  }

  async getById(
    id: number,
    options?: IFindOneOptions<FileEntity>,
  ): Promise<FileEntity | null> {
    const data = await this.fileRepo._findOneById(id, options);
    return data;
  }

  async getOne(
    options: IFindOneOptions<FileEntity>,
  ): Promise<FileEntity | null> {
    const data = await this.fileRepo._findOne(options);
    return data;
  }

  async getAll(options?: IFindAllOptions<FileEntity>): Promise<FileEntity[]> {
    return await this.fileRepo._findAll(options);
  }

  async paginatedGet(options?: IPaginateFindOption<FileEntity>): Promise<{
    data: FileEntity[];
    _pagination: IPaginationMeta;
  }> {
    return await this.fileRepo._paginateFind(options);
  }

  async paginatedQueryBuilderFind(
    options: IPaginateQueryBuilderOption,
  ): Promise<{
    data: FileEntity[];
    _pagination: IPaginationMeta;
  }> {
    return await this.fileRepo._paginatedQueryBuilder(options);
  }

  async softDelete(
    repo: FileEntity,
    options?: IUpdateOptions<FileEntity>,
  ): Promise<FileEntity> {
    return await this.fileRepo._softDelete(repo, options);
  }

  async delete(
    repo: FileEntity,
    options?: IDeleteOptions<FileEntity>,
  ): Promise<FileEntity> {
    return await this.fileRepo._delete(repo, options);
  }

  async restore(options: IUpdateRawOptions<FileEntity>): Promise<UpdateResult> {
    return await this.fileRepo._restoreRaw(options);
  }

  async update(
    repo: FileEntity,
    updateData: QueryDeepPartialEntity<FileEntity>,
    options?: IUpdateOptions<FileEntity>,
  ) {
    Object.assign(repo, updateData);
    return await this.fileRepo._update(repo, options);
  }
  async save(repo: FileEntity, options?: IUpdateOptions<FileEntity>) {
    return await this.fileRepo._update(repo, options);
  }

  async setFeatured(
    fileId: number,
    associationType: FILE_ASSOCIATION_TYPE,
    associationId: number,
    entityManager?: EntityManager,
  ) {
    await this.fileRepo._updateRaw(
      { isFeatured: false },
      {
        entityManager,
        where: {
          associationType,
          associationId,
        },
      },
    );
    const found = await this.getById(fileId, { entityManager });
    if (!found) {
      throw new NotFoundException('Cannot find file');
    }
    found.isFeatured = true;
    await this.fileRepo._update(found, { entityManager });
  }

  // async handlePhotos(
  //   fileData: {
  //     associationId: number;
  //     associationType: FILE_ASSOCIATION_TYPE;
  //     photos: BasePhoto[] | FileEntity[];
  //   },
  //   options?: {
  //     entityManager?: EntityManager;
  //   },
  // ) {
  //   const { associationId, associationType, photos } = fileData;
  //   const { entityManager } = options || {};

  //   const allPhotos = await this.getAll({
  //     options: {
  //       where: {
  //         associationId,
  //         associationType,
  //       },
  //     },
  //     entityManager,
  //   });

  //   const addList = photos?.filter(
  //     (def) => !allPhotos.some((d) => d.id === def.id),
  //   );

  //   let fallbackFeaturedPhotoId: number | null = null;

  //   await Promise.all(
  //     addList.map((addListItem) => {
  //       if (addListItem.id) {
  //         fallbackFeaturedPhotoId = addListItem.id;

  //         return this.addPhoto(
  //           {
  //             associationId,
  //             associationType,
  //             description: addListItem.description || null,
  //             index: addListItem.index || null,
  //             name: addListItem.name || null,
  //             isFeatured: addListItem.isFeatured || false,
  //             photoId: addListItem.id,
  //           },
  //           {
  //             entityManager,
  //           },
  //         );
  //       }

  //       return null;
  //     }),
  //   );
  //   for (const p of allPhotos) {
  //     const foundUpdate = photos.find((def) => def.id === p.id);

  //     if (foundUpdate) {
  //       fallbackFeaturedPhotoId = p.id;

  //       if (foundUpdate?.isFeatured) {
  //         await this.setFeatured(
  //           p.id,
  //           associationType,
  //           associationId,
  //           entityManager,
  //         );
  //       }

  //       Object.assign(p, foundUpdate);

  //       await this.save(p, {
  //         entityManager: options?.entityManager,
  //       });
  //     } else {
  //       await this.softDelete(p, {
  //         entityManager: options?.entityManager,
  //       });
  //     }
  //   }

  //   const hasFeatured = await this.fileRepo._findAll({
  //     entityManager,
  //     options: {
  //       where: {
  //         associationId,
  //         associationType,
  //         isFeatured: true,
  //       },
  //     },
  //   });

  //   if (hasFeatured.length === 0 && fallbackFeaturedPhotoId) {
  //     await this.fileRepo._updateRaw(
  //       {
  //         isFeatured: true,
  //       },
  //       {
  //         entityManager,
  //         where: {
  //           id: fallbackFeaturedPhotoId,
  //           associationType,
  //           associationId,
  //         },
  //       },
  //     );
  //   }
  // }

  /**
   *
   * @param photoData
   * @param options
   * @returns
   */
  async addPhoto(
    photoData: {
      photoId: number;
      associationId: number;
      associationType: FILE_ASSOCIATION_TYPE;
      index: number | null;
      name: string | null;
      description: string | null;
      isFeatured: boolean | null;
    },
    options?: {
      entityManager?: EntityManager;
    },
  ) {
    const {
      photoId,
      associationId,
      associationType,
      index,
      name,
      description,
      isFeatured,
    } = photoData;
    const { entityManager } = options || {};
    const photo = await this.getById(photoId);
    if (!photo) {
      throw new NotFoundException('Cannot find file.');
    }
    if (photo.associationId) {
      throw new BadRequestException('Cannot reuse file.');
    }
    photo.associationType = associationType;
    photo.associationId = associationId;
    photo.index = index;
    
    if (isFeatured) {
      photo.isFeatured = isFeatured;
      await this.setFeatured(
        photoId,
        associationType,
        associationId,
        entityManager,
      );
    }
    return await this.save(photo, {
      entityManager,
    });
  }

  async addFile(
    body: FileUploadDTO | FilesUploadDTO,
    file: IFile,
    __user: UserEntity | null,
    entityManager: EntityManager,
  ) {
    const size: number = file.size;

    const bucket: string | undefined =
      this.configService.get<string>('aws.bucket');

    if (!bucket) {
      throw new InternalServerErrorException({
        statusCode: ENUM_ERROR_STATUS_CODE_ERROR.ERROR_UNKNOWN,
        message: 'Internal Server Error',
      });
    }

    const filename: string = file.originalname;

    const content: Buffer = file.buffer;

    const path = this.awsFileService.getPath(__user, body);
    const newFilename = this.awsFileService.random(20);

    const mime: string = filename
      .substring(filename.lastIndexOf('.') + 1, filename.length)
      .toUpperCase();
    const fileData: AwsS3Serialization = await this.awsService.computedAwsData(
      `${newFilename}.${mime}`,
      {
        path,
      },
    );

    const computedData: IFileInterface = {
      path: fileData.path,
      filename: fileData.filename,
      mime: fileData.mime,
      completeUrl: fileData.completedUrl,
      baseUrl: fileData.baseUrl,
      size: size,
    };

    const result: FileEntity = await this.create(computedData, {
      entityManager,
    });

    if (!result) {
      throw new InternalServerErrorException({
        statusCode: ENUM_ERROR_STATUS_CODE_ERROR.ERROR_UNKNOWN,
        message: 'Internal Server Error',
      });
    }

    const aws: AwsS3Serialization = await this.awsService.putItemInBucket(
      `${newFilename}.${mime}`,
      bucket,
      content,
      { path },
    );

    if (!aws) {
      throw new InternalServerErrorException({
        statusCode: ENUM_ERROR_STATUS_CODE_ERROR.ERROR_UNKNOWN,
        message: 'Internal Server Error',
      });
    }

    return { id: result.id, ...computedData };
  }

  async softDeleteAll(
    associationId: number,
    associationType: FILE_ASSOCIATION_TYPE,
    entityManager?: EntityManager,
  ) {
    await this.fileRepo._softDeleteRaw({
      entityManager,
      where: { associationId, associationType },
    });
  }
}
