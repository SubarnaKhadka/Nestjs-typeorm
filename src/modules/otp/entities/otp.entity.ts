import { Expose } from 'class-transformer';
import { DatabaseBaseEntity } from 'src/common/database/base/entity/BaseEntity';
import { ALL_GROUP } from 'src/common/database/constant/serialization-group.constant';
import { UserEntity } from 'src/modules/user/entities/user.entity';
import { BigIntTransformerPipe } from 'src/utils/bigIntTransformer';
import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { IOtp, OTP_TYPE } from '../interfaces/otp.interface';

export const OTP_TABLE_NAME = 'otp';
@Entity({ name: OTP_TABLE_NAME })
export class OtpEntity extends DatabaseBaseEntity implements IOtp {
  @Expose({ groups: ALL_GROUP })
  @Column({ type: 'timestamptz', nullable: false })
  expiryDate: Date;

  @Expose({ groups: ALL_GROUP })
  @Column({ type: 'varchar', length: 20, nullable: false })
  otp: string;

  @Expose({ groups: ALL_GROUP })
  @Column({ type: 'varchar', length: 50, nullable: false, name: 'otp_type' })
  otpType: OTP_TYPE;

  @Expose({ groups: ALL_GROUP })
  @Column({
    type: 'bigint',
    nullable: false,
    name: 'user_id',
    transformer: new BigIntTransformerPipe(),
  })
  userId: number;

  @ManyToOne(() => UserEntity, (user) => user.id, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'userId' })
  user?: UserEntity;
}
