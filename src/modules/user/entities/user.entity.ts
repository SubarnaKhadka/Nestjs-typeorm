import * as bcrypt from 'bcryptjs';
import { Exclude, Expose } from 'class-transformer';
import { DatabaseBaseEntity } from 'src/common/database/base/entity/BaseEntity';
import {
  ADMIN_ONLY_GROUP,
  ALL_GROUP,
} from 'src/common/database/constant/serialization-group.constant';
import { ObjectToClassTransformer } from 'src/common/database/json-serilization/users-json.transfromer';
import {
  AfterLoad,
  BeforeInsert,
  BeforeUpdate,
  Column,
  Entity,
  Index,
  OneToMany,
} from 'typeorm';
import { IUser, IUserNameJson, USER_TYPE } from '../interfaces/user.interface';
import { ApiProperty } from '@nestjs/swagger';
import { faker } from '@faker-js/faker';
import { FileEntity } from 'src/modules/file/entities/file.entity';
import { FILE_ASSOCIATION_TYPE } from 'src/modules/file/constants/association-type.enum';

export class UserNameJson implements IUserNameJson {
  @ApiProperty({ example: faker.person.firstName() })
  @Expose({ groups: ALL_GROUP })
  firstName?: string | null;

  @ApiProperty({ example: faker.person.lastName() })
  @Expose({ groups: ALL_GROUP })
  lastName?: string | null;

  @ApiProperty({ example: faker.person.middleName() })
  @Expose({ groups: ALL_GROUP })
  middleName?: string | null;

  constructor(obj?: IUserNameJson) {
    this.firstName = null;
    this.lastName = null;
    this.middleName = null;
    if (obj) {
      Object.assign(this, obj);
    }
  }
}

export const USER_TABLE_NAME = 'users';

@Entity({ name: USER_TABLE_NAME })
export class UserEntity extends DatabaseBaseEntity implements IUser {
  profilePicture: null | FileEntity = null;

  @ApiProperty()
  @Expose({ groups: ALL_GROUP })
  @Column({ type: String, length: 100, unique: true, nullable: true })
  email?: string;

  @ApiProperty()
  @Expose({ groups: ALL_GROUP })
  @Column({ type: String, length: 100, unique: true, nullable: true })
  username?: string;

  @ApiProperty()
  @Expose({ groups: ALL_GROUP })
  @Column({ type: String, length: 50, unique: true, nullable: true })
  phone?: string;

  @ApiProperty()
  @Exclude()
  @Column({ type: 'text', nullable: true, select: false })
  password?: string;

  @ApiProperty()
  @Expose({ groups: ALL_GROUP })
  @Index()
  @Column({
    type: 'jsonb',
    nullable: false,
    default: { firstName: null, middleName: null, lastName: null },
    transformer: new ObjectToClassTransformer<UserNameJson>(UserNameJson),
  })
  name: UserNameJson;

  @ApiProperty()
  @Expose({ groups: ADMIN_ONLY_GROUP })
  @Column({ type: Date, nullable: true, name: 'password_last_changed_at' })
  passwordLastChangedAt?: Date | undefined;

  @ApiProperty()
  @Expose({ groups: ADMIN_ONLY_GROUP })
  @Column({ type: 'text', nullable: true, name: 'previous_password' })
  previousPassword?: string | undefined;

  @ApiProperty()
  @Expose({ groups: ADMIN_ONLY_GROUP })
  @Column({ type: Number, default: 0, name: 'password_wrong_attempt' })
  passwordWrongAttempt: number;

  @ApiProperty()
  @Expose({ groups: ALL_GROUP })
  @Column({ type: 'timestamptz', nullable: true, name: 'email_verified_at' })
  emailVerifiedAt?: Date | null;

  @ApiProperty()
  @Expose({ groups: ALL_GROUP })
  @Column({ type: 'timestamptz', nullable: true, name: 'phone_verified_at' })
  phoneVerifiedAt?: Date | null;

  @ApiProperty()
  @Expose({ groups: ALL_GROUP })
  @Column({
    type: String,
    length: 50,
    nullable: false,
    name: 'country_code',
    default: '+977',
  })
  countryCode?: string | undefined;

  @Expose({ groups: ALL_GROUP })
  @Column({ type: Boolean, default: true, name: 'is_active' })
  isActive: boolean;

  @Expose({ groups: ALL_GROUP })
  @Column({ type: 'timestamptz', nullable: true, name: 'registered_at' })
  registeredAt?: Date | undefined;

  @Expose({ groups: ALL_GROUP })
  @Column({ type: String, length: 50, nullable: true })
  type: USER_TYPE;

  @BeforeInsert()
  @BeforeUpdate()
  async hashPasswordBeforeInsertOrUpdate() {
    if (this.password) {
      this.password = await bcrypt.hash(this.password, 10);
    }
  }

  @ApiProperty()
  @Expose({ groups: ALL_GROUP })
  @Column({ type: String, nullable: true })
  gender?: string | undefined;

  @ApiProperty()
  @Expose({ groups: ALL_GROUP })
  @Column({ type: 'date', nullable: true })
  dob?: Date | undefined;

  @Exclude()
  @OneToMany(() => FileEntity, (f) => f.userProfile, {
    createForeignKeyConstraints: false,
  })
  photos?: FileEntity[];

  @AfterLoad()
  afterLoad() {
    if (this.photos) {
      this.photos = this.photos.filter(
        (d) => d.associationType === USER_TABLE_NAME,
      );

      this.profilePicture = this.photos.reduce(
        (latest: FileEntity | null, current: FileEntity) => {
          if (!latest || current.updatedAt > latest.updatedAt) {
            return current;
          } else {
            return latest;
          }
        },
        null,
      );
    }
  }
}
