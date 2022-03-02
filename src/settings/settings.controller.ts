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

  @Post('/')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        metaKey: {
          type: 'string',
        },
        status: { type: 'string' },
      },
    },
  })
  async getSettings(@Request() request) {
    return await this.securityService.getAllSettings(
      request.user,
      request.body,
      request.id,
      request.zip_code,
    );
  }

  @ApiParam({ name: 'id', required: true })
  @ApiQuery({ name: 'zip_code' })
  @Get('/settings/:id')
  async getSettingsDetail(@Param() params, @Request() request: any) {
    return await this.securityService.getSettingsDetail(params.id);
  }

  @UseGuards(AuthGuard('jwt'))
  @Roles(Role.ADMIN)
  @ApiConsumes('multipart/form-data', 'application/json')
  @ApiOperation({
    description:
      'metaValue is an array while creating objects inside for [ (service area) we are adding three parameter required for each {1.zipcode,2.areaName,3.status} ], and for [ (fleet_tax)  we are adding three parameter{1.name,2.type,3.value} ] , and for [ (order_settings) we are adding three parameter{1.order_switch,2.operation_time,3.otp_verification_time} ]',
  })
  @Post('/add')
  @UseInterceptors(
    FilesInterceptor('image', 20, {
      storage: diskStorage({
        destination: './public/uploads',
      }),
    }),
  )
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        metaKey: {
          type: 'String',
        },
        metaValue: { type: 'Array' },
      },
    },
  })
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
  @Put('/service_areas/:id')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        status: { type: 'string' },
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
  @ApiParam({ name: 'id', required: true })
  @ApiQuery({ name: 'zipcode' })
  @ApiConsumes('multipart/form-data', 'application/json')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        zipcode: { type: 'string' },
        default_km: { type: 'number' },
        default_km_charge: { type: 'number' },
        addition_charge: { type: 'number' },
        default_weather_m: { type: 'number' },
        meter_wether_charge: { type: 'number' },
        default_traffic_m: { type: 'number' },
        meter_traffice_charge: { type: 'number' },
      },
    },
  })
  @Put('/updateFuelCharges/:id')
  async updateCharge(
    @Param() params,
    @Query() query,
    @Body() EditSettingsDto: EditSettingsDto,
    @Request() request: any,
  ) {
    await this.securityService.updatecharges(
      params.id,
      EditSettingsDto,
      query.zipcode,
    );
  }

  // @UseGuards(AuthGuard('jwt'))
  // @Roles(Role.ADMIN)
  // @ApiConsumes('multipart/form-data', 'application/json')
  // @ApiParam({ name: 'id', required: true })
  // @Delete('/delete/:id')
  // async deleteSettings(@Param() params, @Request() request: any) {
  //   return await this.securityService.deleteSettings(params.id);
  // }

  @UseGuards(AuthGuard('jwt'))
  @Roles(Role.ADMIN)
  @ApiConsumes('multipart/form-data', 'application/json')
  @ApiParam({ name: 'id', required: true })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        value: { type: 'number' },
        type: { type: 'string' },
        name: { type: 'string' },
      },
    },
  })
  @Put('/tax/:id')
  async taxSettings(
    @Param() params,
    @Body() CreateTaxSettingsDto: EditSettingsDto,
    @Request() request: any,
  ) {
    return await this.securityService.taxSettings(
      params.id,
      CreateTaxSettingsDto,
    );
  }

  @UseGuards(AuthGuard('jwt'))
  @Roles(Role.ADMIN)
  @ApiConsumes('multipart/form-data', 'application/json')
  @ApiParam({ name: 'id', required: true })
  @Put('/fleetorder/:id')
  async orderSettings(
    @Param() params,
    @Body() CreateOrderSettingsDto: CreateOrderSettingsDto,
    @Request() request: any,
  ) {
    return await this.securityService.orderSettings(
      request.params.id,
      CreateOrderSettingsDto,
    );
  }

  @Get()
  async getDA(@Request() request) {
    return await this.securityService.getDelieveryAssociates();
  }
}
