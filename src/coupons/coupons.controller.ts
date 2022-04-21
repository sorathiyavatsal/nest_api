import {
  Controller,
  SetMetadata,
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
  UploadedFiles,
  Delete,
} from '@nestjs/common';
import { request } from 'http';
import { CouponsService } from './coupons.service';
import { toBase64 } from 'utils/common';
import { AuthGuard } from '@nestjs/passport';
import { Roles } from '../auth/roles.decorator';
import { Role } from '../auth/role.enum';
import {
  FileInterceptor,
  FilesInterceptor,
  FileFieldsInterceptor,
} from '@nestjs/platform-express';
import { ApiBody } from '@nestjs/swagger';
import {
  ApiTags,
  ApiProperty,
  ApiSecurity,
  ApiBearerAuth,
  ApiParam,
  ApiConsumes,
  ApiOperation,
} from '@nestjs/swagger';
import { error } from 'console';
import { identity } from 'rxjs';
import { diskStorage } from 'multer';
import { imageFileFilter } from 'src/delivery_fleet/deliveryfleet.controller';

@Controller('coupons')
@ApiTags('Coupons')
@ApiBearerAuth()
@ApiSecurity('api_key')
export class CouponsController {
  constructor(private CouponsService: CouponsService) {}
  //find all coupons here
  @Get('/')
  async getAllCoupons(@Request() request) {
    return await this.CouponsService.getAllCoupons(request.user);
  }

  //{get SingleCouponById here}
  @Get('/:id')
  @ApiParam({ name: 'id', required: true })
  async getSingleCoupon(@Param() params, @Request() request) {
    return await this.CouponsService.getCouponbyId(params.id, request.user);
  }

  //{update promotion by id here}
  @ApiParam({ name: 'id', required: true })
  @Put('/:id')
  @UseInterceptors(FileInterceptor('image'))
  @UseInterceptors(
    FilesInterceptor('image', 20, {
      storage: diskStorage({
        destination: './public/uploads/product/variants',
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
        name: { type: 'string' },
        coupon_code: { type: 'string' },
        coupon_expiration: { type: 'string' },
        coupon_usablenumber: { type: 'number' },
        discount_type: {
          type: 'boolean',
        },
        discount_amount: {
          type: 'number',
        },
        coupon_conditional: { type: 'boolean' },
        min_cart_value: { type: 'number' },
        max_discount_limit: { type: 'number' },
        min_cart_value_flat: { type: 'number' },
        image: {
          type: 'string',
          format: 'binary',
        },
      },
    },
  })
  @ApiConsumes('multipart/form-data', 'application/json')
  async updateCoupon(@Param() params, @Request() request) {
    return await this.CouponsService.updateCoupon(
      params.id,
      request.body,
      request.user,
    );
  }

  //delete api
  @Delete('/:id')
  @ApiParam({ name: 'id', required: true })
  async deleteCoupon(@Param() params, @Request() request) {
    return await this.CouponsService.deleteCoupon(params.id);
  }

  //{create promotion}
  @UseGuards(AuthGuard('jwt'))
  @Post('/')
  @UseInterceptors(FileInterceptor('image'))
  @UseInterceptors(
    FilesInterceptor('image', 20, {
      storage: diskStorage({
        destination: './public/uploads/product/variants',
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
        name: { type: 'string' },
        coupon_code: { type: 'string' },
        coupon_expiration: { type: 'string' },
        coupon_usablenumber: { type: 'number' },
        discount_type: {
          type: 'boolean',
        },
        discount_amount: {
          type: 'number',
        },
        coupon_conditional: { type: 'boolean' },
        min_cart_value: { type: 'number' },
        max_discount_limit: { type: 'number' },
        min_cart_value_flat: { type: 'number' },
        image: {
          type: 'string',
          format: 'binary',
        },
      },
    },
  })
  @ApiConsumes('multipart/form-data', 'application/json')
  @ApiOperation({
    summary:
      'please try here https://documenter.getpostman.com/view/811020/UVC9hkcP',
  })
  async addCategories(@UploadedFile() files, @Request() request) {
    const response = [];
    if (files && files.length > 0) {
      files.forEach((file) => {
        const fileReponse = file.path;
        response.push(fileReponse);
      });
    }
    request.body.image = response[0];

    return await this.CouponsService.createCoupon(request.body, request.user);
  }
}
