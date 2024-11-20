import {
  Controller,
  Get,
  NotFoundException,
  Param,
  Query,
  SerializeOptions,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { PaginateQueryDto } from 'src/common/doc/query/paginateQuery.dto';
import { ResponseMessage } from 'src/common/response/decorators/responseMessage.decorator';
import { HttpLogsResponseSerialization } from '../serializations/http-log.serialization';
import { ApiDocs } from 'src/common/doc/common-docs';
import { HttpLogsService } from '../services/http-logs.service';
import { HttpLogsEntity } from '../entities/http-logs.entity';
import {
  IResponse,
  IResponsePaging,
} from 'src/common/response/interfaces/response.interface';
import { IdParamDto } from 'src/common/dto/id-param.dto';
import { RequestParamGuard } from 'src/common/request/decorators/request.decorator';
import { FindOptionsWhere } from 'typeorm';
import { ADMIN_ONLY_GROUP } from 'src/common/database/constant/serialization-group.constant';
import { UserProtected } from 'src/modules/user/decorators/user.decorator';

@SerializeOptions({
  groups: ADMIN_ONLY_GROUP,
})
@ApiTags('Http-logs')
@Controller({
  version: '1',
  path: '/http-logs',
})
export class HttpLogsAdminController {
  constructor(private readonly httpLogsService: HttpLogsService) {}

  @ApiDocs({
    operation: 'List Logs',
    serialization: HttpLogsResponseSerialization,
  })
  @UserProtected()
  @ResponseMessage('http-logs.list')
  @Get('/list')
  async list(
    @Query() paginateQueryDto: PaginateQueryDto,
  ): Promise<IResponsePaging<HttpLogsEntity>> {
    const where: FindOptionsWhere<HttpLogsEntity> = {};
    const data = await this.httpLogsService.paginatedGet({
      ...paginateQueryDto,
      options: {
        where,
      },
      searchableColumns: ['method', 'remoteUserId', 'responseCode'],
      sortableColumns: [
        'method',
        'remoteUserId',
        'timestamp',
        'responseCode',
        'responseTime',
      ],
    });
    return data;
  }

  @ApiDocs({
    operation: 'Get Http Log',
    params: [
      {
        type: 'number',
        required: true,
        name: 'id',
      },
    ],
  })
  @UserProtected()
  @RequestParamGuard(IdParamDto)
  @ResponseMessage('https-logs.get')
  @Get('/info/:id')
  async getById(@Param('id') id: number): Promise<IResponse<HttpLogsEntity>> {
    const data = await this.httpLogsService.getById(id);
    if (!data) throw new NotFoundException('Cannot Find Log');
    return { data };
  }
}
