import { ApiProperty } from '@nestjs/swagger';
import { Exclude, Expose } from 'class-transformer';
import { BigIntTransformerPipe } from 'src/utils/bigIntTransformer';
import {
  BaseEntity,
  CreateDateColumn,
  DeleteDateColumn,
  Generated,
  PrimaryColumn,
  UpdateDateColumn,
} from 'typeorm';
import {
  ADMIN_ONLY_GROUP,
  ALL_GROUP,
} from '../../constant/serialization-group.constant';

export class DatabaseBaseEntity extends BaseEntity {
  @ApiProperty()
  @Expose({ groups: ALL_GROUP })
  @Generated()
  @PrimaryColumn({
    type: 'bigint',
    transformer: new BigIntTransformerPipe(),
  })
  id: number;

  @Expose({ groups: ADMIN_ONLY_GROUP })
  @CreateDateColumn({ type: 'timestamptz', name: 'created_at' })
  createdAt: Date;

  @Expose({ groups: ALL_GROUP })
  @UpdateDateColumn({ type: 'timestamptz', name: 'updated_at' })
  updatedAt: Date;

  @Exclude()
  @DeleteDateColumn({ type: 'timestamptz', name: 'deleted_at' })
  deletedAt: Date;
}
