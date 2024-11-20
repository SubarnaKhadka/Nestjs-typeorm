import { Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import 'dotenv/config';
import { CommandModule, CommandService } from 'nestjs-command';
import { AdminMigrationSeedModule } from './database/admin/admin.migration.module';

async function bootstrap() {
  try {
    let module: any;
    const service = (process.env.MIGRATION || 'admin')?.toString()?.trim();
    switch (service) {
      case 'admin': {
        module = AdminMigrationSeedModule;
        break;
      }
      default: {
        console.error(`Invalid service: ${service}`);
        process.exit(1);
      }
    }
    const app = await NestFactory.createApplicationContext(module, {
      logger: ['error'],
    });

    const logger = new Logger();

    try {
      await app.select(CommandModule).get(CommandService).exec();
      process.exit(0);
    } catch (err: unknown) {
      logger.error(err, 'Migration');
      process.exit(1);
    }
  } catch (err) {}
}

bootstrap();
