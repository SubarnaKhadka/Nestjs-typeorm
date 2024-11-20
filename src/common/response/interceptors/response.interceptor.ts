import {
  CallHandler,
  ExecutionContext,
  HttpStatus,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { HttpArgumentsHost } from '@nestjs/common/interfaces';
import { Reflector } from '@nestjs/core';
import { Response } from 'express';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { IRequestApp } from 'src/common/request/interfaces/request.interface';
import {
  IPaginationMeta,
  IResponse,
  IResponsePaging,
} from '../interfaces/response.interface';
import { HttpLogsService } from 'src/modules/http-logs/services/http-logs.service';
import { ConfigService } from '@nestjs/config';
import { MessageService } from 'src/common/message/services/message.service';
import {
  IMessage,
  IMessageOptionsProperties,
} from 'src/common/message/interfaces/message.interface';

@Injectable()
export class ResponseDefaultInterceptor<T>
  implements NestInterceptor<Promise<T>>
{
  constructor(
    private readonly reflector: Reflector,
    private readonly httpLoggerService: HttpLogsService,
    private readonly configService: ConfigService,
    private readonly messageService: MessageService,
  ) {}

  async intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Promise<Observable<Promise<any>>> {
    if (context.getType() === 'http') {
      return next.handle().pipe(
        map(async (res: Promise<Record<string, any>>) => {
          const ctx: HttpArgumentsHost = context.switchToHttp();
          const response: Response = ctx.getResponse();
          const request: IRequestApp = ctx.getRequest<IRequestApp>();

          const httpLogsEnabled =
            this.configService.get<string>('app.http.logs');

          let messagePath: string = this.reflector.get<string>(
            'responseMessage',
            context.getHandler(),
          );

          let messageProperties: IMessageOptionsProperties = undefined;

          // metadata
          const __customLang = request.__customLang ?? [
            this.messageService.getLanguage(),
          ];
          const __path = request.path;

          // set default response
          let httpStatus: HttpStatus = response.statusCode;
          let statusCode: number = response.statusCode;
          let data: any = undefined;
          let _pagination: IPaginationMeta | undefined = undefined;
          let metadata: any = {
            path: __path,
            languages: __customLang,
          };

          // response
          const responseData: IResponse | IResponsePaging = await res;

          if (responseData) {
            const { _metadata } = responseData;
            _pagination = (responseData as IResponsePaging)?._pagination;
            data = responseData.data;

            httpStatus = _metadata?.customProperty?.httpStatus ?? httpStatus;
            statusCode = _metadata?.customProperty?.statusCode ?? statusCode;
            messagePath = _metadata?.customProperty?.message ?? messagePath;
            messageProperties =
              _metadata?.customProperty?.messageProperties ?? messageProperties;

            delete _metadata?.customProperty;

            metadata = {
              ...metadata,
            };
          }

          let message: string;

          if (messagePath) {
            message = await this.messageService.get(messagePath, {
              customLanguages: __customLang,
              properties: messageProperties,
            });
          }

          response.status(httpStatus);

          if (httpLogsEnabled) {
            await this.httpLoggerService.create(request, response, {
              statusCode,
              message,
              _metadata: metadata,
              _pagination,
            });
          }

          return {
            statusCode,
            message,
            _metadata: metadata,
            data,
            _pagination,
          };
        }),
      );
    }

    return next.handle();
  }
}
