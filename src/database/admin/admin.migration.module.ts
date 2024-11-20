import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import appConfig from 'src/configs/app.config';
import databaseConfig from 'src/configs/database.config';
import { TypeOrmConfigService } from '../database-config.service';
import { DataSource, DataSourceOptions } from 'typeorm';
import { UserModule } from 'src/modules/user/user.module';
import { MigrateDefaultAdminUser } from './seeds/admin.seed';
import authConfig from 'src/configs/auth.config';
import { CommandModule } from 'nestjs-command';

@Module({
  imports: [
    UserModule,
    CommandModule,
    ConfigModule.forRoot({
      isGlobal: true,
      load: [databaseConfig, appConfig, authConfig],
      envFilePath: ['.env'],
    }),
    TypeOrmModule.forRootAsync({
      useClass: TypeOrmConfigService,
      dataSourceFactory: async (options: DataSourceOptions) => {
        return new DataSource(options).initialize();
      },
    }),
  ],
  providers: [MigrateDefaultAdminUser],
})
export class AdminMigrationSeedModule {}
