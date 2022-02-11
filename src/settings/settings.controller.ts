import {
  Controller,
  SetMetadata,
  Request,
  Get,
  Post,
  Body,
  Delete,
  Put,
  ValidationPipe,
  Query,
  Req,
  Res,
  Param,
  UseGuards,
  UseInterceptors,
  UploadedFile,
} from '@nestjs/common';
import { SettingsService } from './setting.service';
import {
  ApiTags,
  ApiProperty,
  ApiSecurity,
  ApiBearerAuth,
  ApiParam,
  ApiConsumes,
  ApiOperation,
  ApiQuery,
} from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { User } from '../auth/user.model';
import { userInfo } from 'os';
import { Roles } from '../auth/roles.decorator';
import { Role } from '../auth/role.enum';
import { CreateSettingsDto } from './dto/create-settings';
import { EditSettingsDto } from './dto/edit-settings';
import { CreateTaxSettingsDto } from './dto/tax-settings';
import { CreateOrderSettingsDto } from './dto/order-settings';
import {
  FileInterceptor,
  FilesInterceptor,
  FileFieldsInterceptor,
} from '@nestjs/platform-express';
import { ApiBody } from '@nestjs/swagger';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { query } from 'winston';

@Controller('settings')
@ApiTags('Settings')
@ApiBearerAuth()
@ApiSecurity('api_key')
export class SettingsController {
  constructor(private securityService: SettingsService) {}

  @Get('/all')
  async getSettings(@Request() request) {
    return await this.securityService.getAllSettings(request.user);
  }

  @ApiParam({ name: 'id', required: true })
  @Get('/settings/:id')
  async getSettingsDetail(@Param() params, @Request() request: any) {
    return await this.securityService.getSettingsDetail(params.id);
  }

  @UseGuards(AuthGuard('jwt'))
  @Roles(Role.ADMIN)
  @ApiConsumes('multipart/form-data', 'application/json')
  @Post('/add')
  @UseInterceptors(
    FilesInterceptor('image', 20, {
      storage: diskStorage({
        destination: './public/uploads',
      }),
    }),
  )
  async addSettings(
    @Body() createSecurityDto: CreateSettingsDto,
    @Request() request,
  ) {
    return await this.securityService.createSettings(
      createSecurityDto,
      request.user,
    );
  }

  @UseGuards(AuthGuard('jwt'))
  @Roles(Role.ADMIN)
  @ApiParam({ name: 'id', required: true })
  @ApiQuery({ name: 'zip_code' })
  @ApiConsumes('multipart/form-data', 'application/json')
  @Put('/update/:id')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        delivery_service_array: { type: 'array' },
      },
    },
  })
  @ApiConsumes('multipart/form-data', 'application/json')
  async updateSettings(
    @Param() params,
    @Query() query,
    @Body() editSecurityDto: EditSettingsDto,
    @Request() request: any,
  ) {
    return await this.securityService.updateSettings(
      params.id,
      query.zip_code,
      editSecurityDto,
      request.user,
    );
  }

  @UseGuards(AuthGuard('jwt'))
  @Roles(Role.ADMIN)
  @ApiConsumes('multipart/form-data', 'application/json')
  @ApiParam({ name: 'id', required: true })
  @Delete('/delete/:id')
  async deleteSettings(@Param() params, @Request() request: any) {
    return await this.securityService.deleteSettings(params.id);
  }

  @UseGuards(AuthGuard('jwt'))
  @Roles(Role.ADMIN)
  @ApiConsumes('multipart/form-data', 'application/json')
  @ApiParam({ name: 'id', required: true })
  @Put('/tax/:id')
  async taxSettings(
    @Param() params,
    @Body() CreateTaxSettingsDto: CreateTaxSettingsDto,
    @Request() request: any,
  ) {
    return await this.securityService.taxSettings(params.id);
  }

  @UseGuards(AuthGuard('jwt'))
  @Roles(Role.ADMIN)
  @ApiConsumes('multipart/form-data', 'application/json')
  @ApiParam({ name: 'id', required: true })
  @Put('/order/:id')
  async orderSettings(
    @Param() params,
    @Body() CreateOrderSettingsDto: CreateOrderSettingsDto,
    @Request() request: any,
  ) {
    return await this.securityService.orderSettings(params.id);
  }
}
