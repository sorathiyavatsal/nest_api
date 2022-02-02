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
  import { FileInterceptor, FilesInterceptor, FileFieldsInterceptor } from '@nestjs/platform-express'
  import { ApiBody } from '@nestjs/swagger';
  import { ApiTags, ApiProperty, ApiSecurity, ApiBearerAuth, ApiParam, ApiConsumes, ApiOperation } from '@nestjs/swagger';
import { error } from 'console';

@Controller('coupons')
@ApiTags('Coupons')
@ApiBearerAuth()
@ApiSecurity('api_key')

export class CouponsController {
  constructor(private CouponsService: CouponsService) {}
  //find all coupons here
  @Get('/allCoupons')
  async getAllCoupons(@Request() request) {
    return await this.CouponsService.getAllCoupons(request.user);
  }
  //{get SingleCouponById here}
  @Get('/singleCoupon/:id')
  async getSingleCoupon(@Param() params, @Request() request) {
    return await this.CouponsService.getCouponbyId(params.id, request.user);
  }
  //{update promotion by id here}
  @Put('/updateCoupon/:id')
  async updateCoupon(@Param() params, @Request() request) {
    return await this.CouponsService.updateCoupon(
      params.id,
      request.body,
      request.user,
    );
  }
  ///delete api
  @Delete('/deleteCoupon/:id')
  async deleteCoupon(@Param() params, @Request() request) {
    return await this.CouponsService.deleteCoupon(params.id);
  }

  //{create promotion}
  @UseGuards(AuthGuard('jwt'))
  @Roles(Role.ADMIN)
  @Post('/createCoupon')
  @UseInterceptors(FileInterceptor('image'))
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        name: { type: 'string' },
        coupon_code: { type: 'string' },
      },
    },
  })
  @ApiConsumes('multipart/form-data')
  @ApiOperation({
    summary:
      'please try here https://documenter.getpostman.com/view/811020/UVC9hkcP',
  })
  async addCategories(@UploadedFile() file, @Request() request) {
    if (file) {
      request.body.image = await toBase64(file);
    }
    console.log('boydydyddyd', request.body);

    return await this.CouponsService.createCoupon(request.body, request.user);
  }
}