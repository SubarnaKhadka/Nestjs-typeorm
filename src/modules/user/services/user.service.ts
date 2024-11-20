import * as bcrypt from 'bcryptjs';
import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { UserRepository } from '../repositories/user.repository';
import {
  IFindAllOptions,
  IFindOneOptions,
  IPaginateFindOption,
  IPaginateQueryBuilderOption,
} from 'src/common/database/interfaces/findOption.interface';
import { UserEntity, UserNameJson } from '../entities/user.entity';
import {
  IUpdateOptions,
  IUpdateRawOptions,
} from 'src/common/database/interfaces/updateOption.interface';
import { IDeleteOptions } from 'src/common/database/interfaces/deleteOption.interface';
import { DeepPartial, EntityManager, UpdateResult } from 'typeorm';
import { ChangePasswordDto } from '../dtos/change.password.dto';
import { ICreateOptions } from 'src/common/database/interfaces/createOption.interface';
import { IPaginationMeta } from 'src/common/response/interfaces/response.interface';
import { FileRepository } from 'src/modules/file/repositories/file.repository';
import { HelperFileService } from 'src/common/helper/services/helper.file.service';
import { UPLOAD_FOLDER_ENUM } from 'src/modules/file/constants/upload.folder.enum.list';
import { FILE_ASSOCIATION_TYPE } from 'src/modules/file/constants/association-type.enum';

@Injectable()
export class UserService {
  constructor(
    private readonly userRepo: UserRepository,
    private readonly fileRepo: FileRepository,
    private readonly helperService: HelperFileService,
  ) {}

  async getById(
    id: number,
    options?: IFindOneOptions<UserEntity>,
  ): Promise<UserEntity | null> {
    const data = await this.userRepo._findOneById(id, options);
    return data;
  }

  async getOne(
    options: IFindOneOptions<UserEntity>,
  ): Promise<UserEntity | null> {
    const data = await this.userRepo._findOne(options);
    return data;
  }

  async getAll(options?: IFindAllOptions<UserEntity>): Promise<UserEntity[]> {
    return await this.userRepo._findAll(options);
  }

  async paginatedGet(
    options?: IPaginateFindOption<UserEntity>,
  ): Promise<{ data: UserEntity[]; _pagination: IPaginationMeta }> {
    return await this.userRepo._paginateFind(options);
  }

  async paginatedQueryBuilderFind(
    options: IPaginateQueryBuilderOption,
  ): Promise<{
    data: UserEntity[];
    _pagination: IPaginationMeta;
  }> {
    return await this.userRepo._paginatedQueryBuilder(options);
  }

  async softDelete(
    repo: UserEntity,
    options?: IUpdateOptions<UserEntity>,
  ): Promise<UserEntity> {
    return this.userRepo._softDelete(repo, options);
  }

  async delete(
    repo: UserEntity,
    options?: IDeleteOptions<UserEntity>,
  ): Promise<UserEntity> {
    return await this.userRepo._delete(repo, options);
  }

  async restore(options: IUpdateRawOptions<UserEntity>): Promise<UpdateResult> {
    return await this.userRepo._restoreRaw(options);
  }

  async create(
    createDto: DeepPartial<UserEntity>,
    options: ICreateOptions,
  ): Promise<UserEntity> {
    const data = this.userRepo._create(createDto, {
      entityManager: options?.entityManager,
    });
    return data;
  }

  async update(
    repo: UserEntity,
    updateData: Partial<UserEntity> & { profilePictureId?: number },
    options?: IUpdateOptions<UserEntity>,
  ): Promise<UserEntity> {
    if (updateData?.email && updateData.email !== repo.email) {
      repo.emailVerifiedAt = null;
    }
    if (updateData?.phone && updateData.phone !== repo.phone) {
      repo.phoneVerifiedAt = null;
    }

    Object.assign(repo, updateData);

    if (updateData.profilePictureId) {
      const photo = await this.fileRepo._findOneById(
        updateData.profilePictureId,
      );

      if (!photo) {
        throw new BadRequestException('file.error.photoNotFound');
      }

      const isPhotoUserProfile = this.helperService.isPhotoAssociatedWith(
        photo.path,
        UPLOAD_FOLDER_ENUM.USER,
      );

      if (!isPhotoUserProfile) {
        throw new BadRequestException('file.error.otherAssociated');
      }
      photo.associationType = FILE_ASSOCIATION_TYPE.USER;
      photo.associationId = repo.id;

      await this.fileRepo._update(photo, {
        entityManager: options?.entityManager,
      });
    }

    if (updateData.name) {
      updateData.name = new UserNameJson(updateData.name);
    }

    delete repo.password;

    return await this.userRepo._update(repo, {
      entityManager: options?.entityManager,
    });
  }

  async checkUserExists(
    user: Partial<UserEntity>,
    entityManager?: EntityManager,
  ): Promise<void> {
    if (user.email) {
      const found = await this.getOne({
        entityManager,
        options: {
          where: {
            email: user.email,
          },
        },
      });

      if (found) {
        throw new BadRequestException('user.error.emailExist');
      }
    }
    if (user.phone) {
      const found = await this.getOne({
        entityManager,
        options: {
          where: {
            phone: user.phone,
          },
        },
      });
      if (found) {
        throw new BadRequestException('user.error.mobileNumberExist');
      }
    }

    if (user.username) {
      const found = await this.getOne({
        entityManager,
        options: {
          where: {
            username: user.username,
          },
        },
      });
      if (found) {
        throw new BadRequestException('user.error.userNameExist');
      }
    }
  }

  async changePassword(
    repo: UserEntity,
    updateData: Partial<UserEntity & ChangePasswordDto>,
    options?: IUpdateOptions<UserEntity>,
  ): Promise<UserEntity> {
    const found: UserEntity | null = await this.getById(repo.id, {
      options: {
        select: {
          password: true,
          id: true,
        },
      },
    });
    if (!found) throw new NotFoundException('user.error.notFound');

    if (updateData.oldPassword && found.password) {
      const match = bcrypt.compareSync(updateData.oldPassword, found.password);

      if (!match) {
        throw new BadRequestException('user.error.oldPasswordNotMatch');
      }

      delete updateData.oldPassword;
      updateData.passwordLastChangedAt = new Date();

      Object.assign(repo, updateData);
      return await this.userRepo._update(repo, options);
    }
  }

  async setPassword(
    repo: UserEntity,
    updateData: Partial<UserEntity>,
    options?: IUpdateOptions<UserEntity>,
  ): Promise<UserEntity> {
    Object.assign(repo, updateData);
    return await this.userRepo._update(repo, options);
  }
}
