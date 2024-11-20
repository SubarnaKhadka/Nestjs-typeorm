import { Body, Controller, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { ApiDocs } from 'src/common/doc/common-docs';
import { ResponseMessage } from 'src/common/response/decorators/responseMessage.decorator';
import { BackUpDataBaseSerialization } from '../serialization/backup.database.serialization';
import { BackUpService } from '../services/backup.service';
import { TableDtos } from '../dtos/backup.table.dto';
import { BackUpTableSerialization } from '../serialization/backup.tables.serialization';
import { UserProtected } from 'src/modules/user/decorators/user.decorator';

@Controller('backup')
@ApiTags('DataBase BackUp')
export class BackUpController {
  constructor(private readonly backUpService: BackUpService) {}

  @ApiDocs({
    operation: 'Create Database BackUp',
    serialization: BackUpDataBaseSerialization,
  })
  @UserProtected()
  @ResponseMessage('backup.databaseBackupCreate')
  @Post('/database')
  async createDataBaseBackUp() {
    return this.backUpService.dump();
  }

  @ApiDocs({
    operation: 'Create Database Tables BackUp',
    serialization: BackUpTableSerialization,
  })
  @UserProtected()
  @ResponseMessage('backup.tableBackupCreate')
  @Post('/tables')
  async createDataBaseTablesBackUp(@Body() tables: TableDtos) {
    return this.backUpService.dumpTables(tables);
  }
}
