import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { DatabaseBaseEntity } from 'src/common/database/base/entity/BaseEntity';
import { Column, Entity } from 'typeorm';
import { IHttpLogs } from '../interfaces/http-logs.interface';
import { ADMIN_ONLY_GROUP } from 'src/common/database/constant/serialization-group.constant';

export const TABLE_NAME = 'http-logs';
@Entity({ name: TABLE_NAME })
export class HttpLogsEntity extends DatabaseBaseEntity implements IHttpLogs {
  @ApiProperty()
  @Expose({ groups: ADMIN_ONLY_GROUP })
  @Column({ type: 'text', nullable: true })
  method: string;

  @ApiProperty()
  @Expose({ groups: ADMIN_ONLY_GROUP })
  @Column({ type: 'text', nullable: true })
  timezone: string;

  @ApiProperty()
  @Expose({ groups: ADMIN_ONLY_GROUP })
  @Column({ type: 'text', name: 'remote_address', nullable: true })
  remoteAddress: string | null;

  @ApiProperty()
  @Expose({ groups: ADMIN_ONLY_GROUP })
  @Column({ type: 'int', name: 'remote_user_id', nullable: true })
  remoteUserId: number | null;

  @ApiProperty()
  @Expose({ groups: ADMIN_ONLY_GROUP })
  @Column({ type: 'text', nullable: true })
  url: string;

  @ApiProperty()
  @Expose({ groups: ADMIN_ONLY_GROUP })
  @Column({ type: 'jsonb', name: 'query_params', nullable: true })
  queryParams: Record<string, any>;

  @ApiProperty()
  @Expose({ groups: ADMIN_ONLY_GROUP })
  @Column({ type: 'jsonb', nullable: true })
  metadata: Record<string, any>;

  @ApiProperty()
  @Expose({ groups: ADMIN_ONLY_GROUP })
  @Column({ type: 'jsonb', nullable: true })
  params: Record<string, any>;

  @ApiProperty()
  @Expose({ groups: ADMIN_ONLY_GROUP })
  @Column({ type: 'text', name: 'user_agent', nullable: true })
  userAgent: string | null;

  @ApiProperty()
  @Expose({ groups: ADMIN_ONLY_GROUP })
  @Column({ type: 'text', nullable: true })
  hostname: string;

  @ApiProperty()
  @Expose({ groups: ADMIN_ONLY_GROUP })
  @Column({ type: 'bigint', nullable: true })
  timestamp: number;

  @ApiProperty()
  @Expose({ groups: ADMIN_ONLY_GROUP })
  @Column({ type: 'int', name: 'response_code', nullable: true })
  responseCode: number;

  @ApiProperty()
  @Expose({ groups: ADMIN_ONLY_GROUP })
  @Column({ type: 'int', name: 'response_time', nullable: true })
  responseTime: number;
}
