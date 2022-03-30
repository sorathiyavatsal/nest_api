import {
  Controller,
  SetMetadata,
  UploadedFiles,
  Request,
  Get,
  Post,
  Body,
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
import { DeliveryFleetService } from './deliveryfleet.service';
import {
  ApiTags,
  ApiSecurity,
  ApiBearerAuth,
  ApiParam,
  ApiConsumes,
  ApiOperation,
  ApiQuery,
} from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { Roles } from '../auth/roles.decorator';
import { CreateDeliveryFleetDto } from './dto/create-deliveryfleet';
import { EditDeliveryFleetDto } from './dto/edit-deliveryfleet';
import { DeliveryChargesDto } from './dto/deliverycharges';
import { DeliveryDistanceDto } from './dto/deliverydistance';
import {
  FileInterceptor,
  FilesInterceptor,
  FileFieldsInterceptor,
} from '@nestjs/platform-express';
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
  constructor(private deliveryService: DeliveryFleetService) {}

  @Post('/fleet-process/delivery-fee')
  async getDeliveryCharges(@Body() Dto: DeliveryChargesDto) {
    return await this.deliveryService.getDeliveryCharges(Dto);
  }

  @Post('/find-near-delivery-boy')
  async getDeliveryBoyNear(@Body() Dto: DeliveryDistanceDto) {
    return await this.deliveryService.getDeliveyBoyNear(Dto);
  }

  @Get('/')
  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'))
  @ApiQuery({ name: 'merchantid', required: true })
  @ApiQuery({ name: 'page', type: 'number', required: false })
  @ApiQuery({ name: 'limit', type: 'number', required: false })
  @ApiQuery({
    name: 'sort_order',
    type: 'string',
    required: false,
    enum: ['AESC', 'DESC'],
  })
  @ApiQuery({
    name: 'sort',
    type: 'string',
    required: false,
    enum: ['NAME', 'DATE', 'PRICE', 'KEYWORD'],
  })
  async getDeliveryFleet(@Req() req, @Query() query) {
    return await this.deliveryService.getDeliveryFleet(req.user, query);
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
    return await this.deliveryService.getDeliveryFleetLocationData(
      params.id,
      req,
      req.user,
    );
  }

  @Get('/users/:userId')
  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'))
  @ApiQuery({
    name: 'userType',
    type: 'string',
    enum: ['GENERAL', 'DA'],
    required: true,
  })
  @ApiParam({ name: 'userId', type: 'string', required: true })
  @ApiQuery({
    name: 'status',
    type: 'string',
    enum: [
      'progress',
      'pending',
      'complete',
      'dispatched',
      'delivered',
      'cancelled',
      'faliure',
      'accepted',
      'pickup',
    ],
    required: false,
  })
  @ApiQuery({ name: 'from_date', type: 'string', required: false })
  @ApiQuery({ name: 'to_date', type: 'string', required: false })
  async getDeliveryFleetBoy(@Query() query, @Param() params) {
    return await this.deliveryService.getDeliveryFleetBoy(query,params.userId);
  }

  @Put('/update/payment/:id')
  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'))
  @ApiParam({ name: 'id', required: true })
  async updateDeliveryFleetPayment(
    @Param() params,
    @Body() dto: DeliveryPaymentUpdateDto,
    @Req() req,
  ) {
    return await this.deliveryService.updateDeliveryFleetPayment(
      params.id,
      dto,
      req.user,
    );
  }
  @Put('/update/status/:id')
  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'))
  @ApiParam({ name: 'id', required: true })
  @ApiOperation({
    description:
      "status is pickup when delivery boy verify  goods pickup location, Pickup location contact number will receive the OTP.Before start from the pickup location  need update another status is 'progress' \n with otp from pickup location contact number. OTP is falid or not receive you can update status pickup to send otp again.Before deliver the goods need update status 'delivered'.Once you update status is deliverd drop location contact person will receive the otp, you can use with otp for update the status 'complete'",
    summary:
      "Delivery boy ['progress','pending','complete','dispatched','delivered','cancelled','faliure','accepted','pickup'] status",
  })
  async updateDeliveryFleetStatus(
    @Param() params,
    @Body() dto: DeliveryStatusDto,
    @Req() req,
  ) {
    return await this.deliveryService.updateDeliveryStatus(
      params.id,
      dto,
      req.user,
    );
  }
  @Put('/update/location/:id/:user')
  @ApiParam({ name: 'id', required: true })
  @ApiParam({ name: 'user', required: true })
  async updateLocationDeliveryFleet(
    @Param() params,
    @Body() dto: DeliveryDistanceUpdateDto,
    @Req() req,
  ) {
    return await this.deliveryService.updateLocationDeliveryFleet(
      params.id,
      dto,
      req,
      params.user,
    );
  }
  @Put('/update/:id')
  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'))
  @UseInterceptors(
    FilesInterceptor('image', 20, {
      storage: diskStorage({
        destination: './public/uploads',
        filename: function (req, file, cb) {
          let extArray = file.mimetype.split('/');
          let extension = extArray[extArray.length - 1];
          cb(null, file.fieldname + '-' + Date.now() + '.' + extension);
        },
      }),
      fileFilter: imageFileFilter,
    }),
  )
  @ApiConsumes('multipart/form-data', 'application/json')
  @ApiParam({ name: 'id', required: true })
  @ApiOperation({ summary: 'Update Delivery Fleet' })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        fromName: { type: 'string' },
        fromAddress: { type: 'string' },
        fromZipcode: { type: 'string' },
        fromLat: { type: 'string' },
        fromLng: { type: 'string' },
        fromPhone: { type: 'string' },
        toName: { type: 'string' },
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
  async updateDeliveryFleet(
    @Param() params,
    @UploadedFiles() files,
    @Req() req,
  ) {
    const response = [];
    if (files && files.length > 0) {
      files.forEach((file) => {
        const fileReponse = file;
        response.push(fileReponse);
      });
    }
    return await this.deliveryService.updateDeliveryFleet(
      params.id,
      response,
      req,
    );
  }

  @Post('/add')
  @UseInterceptors(
    FilesInterceptor('image', 20, {
      storage: diskStorage({
        destination: './public/uploads',
        filename: function (req, file, cb) {
          let extArray = file.mimetype.split('/');
          let extension = extArray[extArray.length - 1];
          cb(null, file.fieldname + '-' + Date.now() + '.' + extension);
        },
      }),
      fileFilter: imageFileFilter,
    }),
  )
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        fromName: { type: 'string' },
        fromAddress: { type: 'string' },
        fromZipcode: { type: 'string' },
        fromLat: { type: 'string' },
        fromLng: { type: 'string' },
        fromPhone: { type: 'string' },
        toName: { type: 'string' },
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
        deliverChargeType: {
          type: 'string',
          enum: ['1', '2', '3'],
        },
        invoiceStatus: {
          type: 'string',
          enum: [
            'progress',
            'pending',
            'complete',
            'dispatched',
            'delivered',
            'cancelled',
            'faliure',
            'accepted',
            'pickup',
          ],
        },
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
  @ApiOperation({ summary: 'Add Delivery Fleet' })
  @ApiConsumes('multipart/form-data', 'application/json')
  async addInvoice(@UploadedFiles() files, @Req() res) {
    const response = [];
    if (files && files.length > 0) {
      files.forEach((file) => {
        const fileReponse = file;
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
