import {
  ClassSerializerInterceptor,
  Logger,
  VersioningType,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestApplication, NestFactory, Reflector } from '@nestjs/core';
import { useContainer } from 'class-validator';
import { AppModule } from 'src/app/app.module';
import swaggerInit from './swagger';

async function bootstrap() {
  const app: NestApplication = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);
  const databaseUri: string = configService.get<string>('database.host');
  const env: string = configService.get<string>('app.env');
  const host: string = configService.get<string>('app.http.host');
  const port: number = configService.get<number>('app.http.port');
  const globalPrefix: string = configService.get<string>('app.globalPrefix');
  const versioningPrefix: string = configService.get<string>(
    'app.versioning.prefix',
  );
  const version: string = configService.get<string>('app.versioning.version');

  app.enableCors();

  app.useGlobalInterceptors(new ClassSerializerInterceptor(app.get(Reflector)));

  const httpEnable: boolean = configService.get<boolean>('app.http.enable');
  const versionEnable: string = configService.get<string>(
    'app.versioning.enable',
  );
  const jobEnable: boolean = configService.get<boolean>('app.jobEnable');

  const logger = new Logger();
  process.env.NODE_ENV = env;

  app.setGlobalPrefix(globalPrefix);
  useContainer(app.select(AppModule), { fallbackOnErrors: true });

  if (versionEnable) {
    app.enableVersioning({
      type: VersioningType.URI,
      defaultVersion: version,
      prefix: versioningPrefix,
    });
  }

  await swaggerInit(app);

  await app.listen(port, host);

  logger.log(`==========================================================`);

  logger.log(`Job is ${jobEnable}`, 'NestApplication');
  logger.log(
    `Http is ${httpEnable}, ${
      httpEnable ? 'routes registered' : 'no routes registered'
    }`,
    'NestApplication',
  );
  logger.log(`Http versioning is ${versionEnable}`, 'NestApplication');

  logger.log(`Http Server running on ${await app.getUrl()}`, 'NestApplication');
  logger.log(`Database uri ${databaseUri}`, 'NestApplication');

  logger.log(`==========================================================`);
}
bootstrap();
