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
//  @ApiOperation({summary:"in this section we are getting setting existing in database on the bases of if they are active or not so we have to put specified data into the body in order to get it"})
//  @Post('/')
//   @ApiBody({
//     schema: {
//       type: 'object',
//       properties: {
//         metaKey: {
//           type: 'string',
//         },
//         status: { type: 'string' },
//       },
//     },
//   })
  
//   async getSettings(@Request() request) {
//     return await this.securityService.getAllSettings(
//       request.user,
//       request.body,
//       request.id,
//       request.zip_code,
//     );
//   }
  
  @ApiOperation({
    summary:"get settings on the bases of id and query"
  })
 @ApiBody({
   schema:{
     properties:{
       metakey:{type:'string'}
     }
   }
 })
  @Post('/serviceAreas')
  async getSettingsDetail( @Request() request: any) {
    return await this.securityService.getSettings(request.body);
  }

  @UseGuards(AuthGuard('jwt'))
  @Roles(Role.ADMIN)
  @ApiConsumes('multipart/form-data', 'application/json')
  @ApiOperation({
    summary:
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
  @ApiOperation({summary:"update status of service area on the bases of query and id "})

  @ApiConsumes('multipart/form-data', 'application/json')
  @Put('/UpdateServiceAreas/:id')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        status: { type: 'string' },
      },
    },
  })

  @ApiConsumes('multipart/form-data', 'application/json')
  @ApiOperation({
  summary:"update status of serviece area"
  })
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
  @ApiOperation({summary:"first thing we are putting zipcode in query and object id in param section and the update will happendon the bases of id and if there is no zipcode in query it will add an element to the object with new zipcode and its properties"})
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
  @ApiOperation({
    summary: "value has a data type of number and the rest are string and they all will uodate on the bases of id in params"
  })
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
   @ApiOperation({
    summary: "order_switch has a data type of true/flase and the rest are number and they all will uodate on the bases of id in params"
  })
  @ApiParam({ name: 'id', required: true })
  @Put('/fleetOrder/:id')
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
