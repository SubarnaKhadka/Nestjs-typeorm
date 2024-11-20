import { Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestApplication } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ENUM_APP_ENVIRONMENT } from 'src/app/constants/app.enum.constant';
import { AdminRouterModule } from './router/routes/admin.router.module';
import { CustomerRouterModule } from './router/routes/customer.router.module';
import {
  ResponseDefaultSerialization,
  ResponsePaginationDefaultSerialization,
} from './common/doc/serializations/response.default.serialization';
import { VendorRouterModule } from './router/routes/vendor.router.module';

export default async function (app: NestApplication) {
  const configService = app.get(ConfigService);
  const env: string = configService.get<string>('app.env', 'local');
  const logger = new Logger();

  const docName: string = configService.get<string>('doc.name', '');
  const docDesc: string = configService.get<string>('doc.description', '');
  const docVersion: string = configService.get<string>('doc.version', '');
  const docPrefix: string = configService.get<string>('doc.prefix', '');

  if (env !== ENUM_APP_ENVIRONMENT.PRODUCTION) {
    const documentBuild = new DocumentBuilder()
      .setTitle(docName)
      .setDescription(docDesc)
      .setVersion(docVersion)
      .addServer('/')
      .addBearerAuth(
        { type: 'http', scheme: 'bearer', bearerFormat: 'JWT' },
        'accessToken',
      )
      .addBearerAuth(
        { type: 'http', scheme: 'bearer', bearerFormat: 'JWT' },
        'refreshToken',
      )
      .build();

    SwaggerModule.createDocument(app, documentBuild, {
      deepScanRoutes: true,
      extraModels: [
        ResponseDefaultSerialization,
        ResponsePaginationDefaultSerialization,
      ],
    });

    const adminDocumentBuild = new DocumentBuilder()
      .setTitle('Admin Api')
      .setDescription('Rest APIs ')
      .setVersion('1')
      .addBearerAuth(
        { type: 'http', scheme: 'bearer', bearerFormat: 'JWT' },
        'accessToken',
      )
      .addBearerAuth(
        { type: 'http', scheme: 'bearer', bearerFormat: 'JWT' },
        'refreshToken',
      )
      .build();

    const adminDocument = SwaggerModule.createDocument(
      app,
      adminDocumentBuild,
      {
        deepScanRoutes: true,
        include: [AdminRouterModule],
      },
    );

    SwaggerModule.setup('admin-docs', app, adminDocument, {
      explorer: true,
      customSiteTitle: 'Admin',
      swaggerOptions: {
        docExpansion: 'none',
        filter: true,
        showRequestDuration: true,
        persistAuthorization: true,
      },
    });

    const vendorDocumentBuild = new DocumentBuilder()
      .setTitle('Vendor Api')
      .setDescription('Vendor')
      .setVersion('1')
      .addBearerAuth(
        { type: 'http', scheme: 'bearer', bearerFormat: 'JWT' },
        'accessToken',
      )
      .addBearerAuth(
        { type: 'http', scheme: 'bearer', bearerFormat: 'JWT' },
        'refreshToken',
      )

      .build();

    const vendorDocument = SwaggerModule.createDocument(
      app,
      vendorDocumentBuild,
      {
        deepScanRoutes: true,
        include: [VendorRouterModule],
      },
    );

    SwaggerModule.setup('vendor-docs', app, vendorDocument, {
      explorer: true,
      customSiteTitle: 'Vendor',
      swaggerOptions: {
        docExpansion: 'none',
        filter: true,
        showRequestDuration: true,
        persistAuthorization: true,
      },
    });

    const customerDocumentBuild = new DocumentBuilder()
      .setTitle('Customer Api')
      .setDescription('Rest APIs for Customer')
      .setVersion('1')
      .addBearerAuth(
        { type: 'http', scheme: 'bearer', bearerFormat: 'JWT' },
        'accessToken',
      )
      .addBearerAuth(
        { type: 'http', scheme: 'bearer', bearerFormat: 'JWT' },
        'refreshToken',
      )

      .build();

    const customerDocument = SwaggerModule.createDocument(
      app,
      customerDocumentBuild,
      {
        deepScanRoutes: true,
        include: [CustomerRouterModule],
      },
    );

    SwaggerModule.setup('customer-docs', app, customerDocument, {
      explorer: true,
      customSiteTitle: 'Customer',
      swaggerOptions: {
        docExpansion: 'none',
        filter: true,
        showRequestDuration: true,
        persistAuthorization: true,
      },
    });

    logger.log(`==========================================================`);

    logger.log(`Docs will serve on ${docPrefix}`, 'NestApplication');

    logger.log(`==========================================================`);
  }
}
