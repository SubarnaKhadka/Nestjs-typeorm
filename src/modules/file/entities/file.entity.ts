import { Expose } from 'class-transformer';
import { DatabaseBaseEntity } from 'src/common/database/base/entity/BaseEntity';
import { ALL_GROUP } from 'src/common/database/constant/serialization-group.constant';
import { UserEntity } from 'src/modules/user/entities/user.entity';
import { BigIntTransformerPipe } from 'src/utils/bigIntTransformer';
import { Column, Entity, Index, JoinColumn, ManyToOne } from 'typeorm';
import { FILE_ASSOCIATION_TYPE } from '../constants/association-type.enum';
import { IFileInterface } from '../interfaces/file.interfaces';

export const FILE_TABLE_NAME = 'files';

@Entity({ name: FILE_TABLE_NAME })
export class FileEntity extends DatabaseBaseEntity implements IFileInterface {
  @Expose({ groups: ALL_GROUP })
  @Column({ type: 'varchar', length: 255 })
  path: string;

  @Expose({ groups: ALL_GROUP })
  @Column({ type: 'varchar', length: 255 })
  filename: string;

  @Expose({ groups: ALL_GROUP })
  @Column({ type: 'varchar', length: 50 })
  mime: string;

  @Expose({ groups: ALL_GROUP })
  @Column({
    type: 'bigint',
    nullable: true,
    transformer: new BigIntTransformerPipe(),
  })
  size?: number;

  @Expose({ groups: ALL_GROUP })
  @Column({ type: 'int', nullable: true })
  index: number | null;

  @Expose({ groups: ALL_GROUP })
  @Column({ type: Boolean, default: false, name: 'is_featured' })
  isFeatured?: boolean;

  @Expose({ groups: ALL_GROUP })
  @Index()
  @Column({
    type: 'bigint',
    nullable: true,
    name: 'association_id',
    transformer: new BigIntTransformerPipe(),
  })
  associationId?: number | null;

  @Expose({ groups: ALL_GROUP })
  @Index()
  @Column({
    type: 'varchar',
    length: 100,
    name: 'association_type',
    nullable: true,
  })
  associationType?: FILE_ASSOCIATION_TYPE | null;

  @ManyToOne(() => UserEntity, (u) => u.id, {
    createForeignKeyConstraints: false,
  })
  @JoinColumn({ name: 'association_id' })
  userProfile: UserEntity;
}
