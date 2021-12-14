import { Controller, SetMetadata, UploadedFiles, Request, Get, Post, Body, Put, ValidationPipe, Query, Req, Res, Param, UseGuards, UseInterceptors, UploadedFile } from '@nestjs/common';
import { DeliveryFleetService } from "./deliveryfleet.service"
import { ApiTags, ApiSecurity, ApiBearerAuth, ApiParam, ApiConsumes, ApiOperation } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { User } from "../auth/user.model";
import { userInfo } from 'os';
import { Roles } from '../auth/roles.decorator';
import { Role } from '../auth/role.enum';
import { CreateDeliveryFleetDto } from './dto/create-deliveryfleet';
import { EditDeliveryFleetDto } from './dto/edit-deliveryfleet';
import { DeliveryChargesDto } from './dto/deliverycharges';
import { DeliveryDistanceDto } from './dto/deliverydistance'
import { FileInterceptor, FilesInterceptor, FileFieldsInterceptor } from '@nestjs/platform-express'
import { Express } from 'express';
import { ApiBody } from '@nestjs/swagger';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { DeliveryPaymentUpdateDto } from './dto/deliverypayment';
import { DeliveryDistanceUpdateDto } from './dto/deliverydistanceupdate';
import { DeliveryStatusDto } from './dto/deliveryStatus';
@Controller('delivery-fleet')
@ApiTags('Delivery Fleet')
@ApiSecurity('api_key')

export class DeliveryFleetController {
  constructor(private deliveryService: DeliveryFleetService) {

  }

  @Post('/delivery-fee')

  async getDeliveryCharges(@Body() Dto: DeliveryChargesDto) {

    return await this.deliveryService.getDeliveryCharges(Dto);
  }


  @Post("/find-distance")
  async getDeliveryDistance(@Body() Dto: DeliveryDistanceDto) {

    return await this.deliveryService.getDeliveyDistance(Dto);
  }

  @Get('/')
  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'))
  async getDeliveryFleet(@Req() req) {

    return await this.deliveryService.getDeliveryFleet(req.user);
  }

  @Get('/:id')
  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'))
  @ApiParam({ name: 'id', required: true })
  async getDeliveryFleetData(@Param() params, @Req() req) {

    return await this.deliveryService.getDeliveryFleetData(params.id, req);
  }
  @Get('/location/:id')
  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'))
  @ApiParam({ name: 'id', required: true })
  async getDeliveryFleetLocationData(@Param() params, @Req() req) {

    return await this.deliveryService.getDeliveryFleetData(params.id, req);
  }
  @Put('/update/payment/:id')
  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'))
  async updateDeliveryFleetPayment(@Param() params, @Body()  dto:DeliveryPaymentUpdateDto,@Req() req) {

    return await this.deliveryService.updateDeliveryFleetPayment(params.id,dto,req.user);
  }
  @Put('/update/status/:id')
  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'))
  @ApiOperation({ summary: 'Delivery boy declined/rejected status' })
  async updateDeliveryFleetStatus(@Param() params, @Body()  dto:DeliveryStatusDto,@Req() req) {

    return await this.deliveryService.updateDeliveryStatus(params.id,dto,req.user);
  }
  @Put('/update/location/:id')
  @ApiParam({ name: 'id', required: true })
  async updateLocationDeliveryFleet(@Param() params, @Body()  dto:DeliveryDistanceUpdateDto,@Req() req) {
    
    return await this.deliveryService.updateLocationDeliveryFleet(params.id,dto,req);
  }
  @Put('/update/:id')
  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'))
  @UseInterceptors(
    FilesInterceptor('image', 20, {
      storage: diskStorage({
        destination: './public/uploads',
        filename: function (req, file, cb) {
          let extArray = file.mimetype.split("/");
          let extension = extArray[extArray.length - 1];
          cb(null, file.fieldname + '-' + Date.now() + '.' + extension)
        }
      }),
      fileFilter: imageFileFilter,
    }),
  )
  @ApiConsumes('multipart/form-data')
  @ApiParam({ name: 'id', required: true })
  @ApiOperation({ summary: 'please try here https://documenter.getpostman.com/view/811020/UVC9hkcP' })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        fromAddress: { type: 'string' },
        fromZipcode: { type: 'string' },
        fromLat: { type: 'string' },
        fromLng: { type: 'string' },
        fromPhone: { type: 'string' },
        toAddress: { type: 'string' },
        toZipcode: { type: 'string' },
        toLat: { type: 'string' },
        toLng: { type: 'string' },
        toPhone: { type: 'string' },
        goods: { type: 'string' },
        numberofPack: { type: 'string' },
        weightPack: { type: 'string' },
        pickupType: { type: 'string' },
        pickupDate: { type: 'string' },
        pickupTime: { type: 'string' },
        cor: { type: 'string' },
        deliverChargeType: { type: 'string' },
        invoiceStatus: { type: 'string' },
        activeStatus: { type: 'boolean' },
        distance: { type: 'string' },
        price: { type: 'number' },
        image: {

          type: 'array',
          items: {
            type: 'string',
            format: 'binary',
          },
        },

      },
    },
  })
  async updateDeliveryFleet(@Param() params, @UploadedFiles() files, @Req() req) {
    
    const response = [];
    if (files && files.length > 0) {
      files.forEach(file => {
        const fileReponse = file
        response.push(fileReponse);
      });
    }
    return await this.deliveryService.updateDeliveryFleet(params.id, response, req);
  }


  @Post('/add')
  @UseInterceptors(
    FilesInterceptor('image', 20, {
      storage: diskStorage({
        destination: './public/uploads',
        filename: function (req, file, cb) {
          let extArray = file.mimetype.split("/");
          let extension = extArray[extArray.length - 1];
          cb(null, file.fieldname + '-' + Date.now() + '.' + extension)
        }
      }),
      fileFilter: imageFileFilter,
    }),
  )
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        fromAddress: { type: 'string' },
        fromZipcode: { type: 'string' },
        fromLat: { type: 'string' },
        fromLng: { type: 'string' },
        fromPhone: { type: 'string' },
        toAddress: { type: 'string' },
        toZipcode: { type: 'string' },
        toLat: { type: 'string' },
        toLng: { type: 'string' },
        toPhone: { type: 'string' },
        goods: { type: 'string' },
        numberofPack: { type: 'string' },
        weightPack: { type: 'string' },
        pickupType: { type: 'string' },
        pickupDate: { type: 'string' },
        pickupTime: { type: 'string' },
        cor: { type: 'string' },
        deliverChargeType: { type: 'string' },
        invoiceStatus: { type: 'string' },
        activeStatus: { type: 'boolean' },
        distance: { type: 'string' },
        price: { type: 'number' },
        image: {

          type: 'array',
          items: {
            type: 'string',
            format: 'binary',
          },
        },

      },
    },
  })
  @ApiOperation({ summary: 'please try here https://documenter.getpostman.com/view/811020/UVC9hkcP' })
  @ApiConsumes('multipart/form-data')
  async addInvoice(@UploadedFiles() files, @Req() res) {
  
    const response = [];
    if (files && files.length > 0) {
      files.forEach(file => {
        const fileReponse = file
        response.push(fileReponse);
      });
    }

    return await this.deliveryService.createnewDeliveryFleet(response, res);
  }

}
export const imageFileFilter = (req, file, callback) => {
  if (!file.originalname.match(/\.(jpg|jpeg|png|gif)$/)) {
    return callback(new Error('Only image files are allowed!'), false);
  }
  callback(null, true);
};

