import {
  Controller,
  SetMetadata,
  Request,
  Get,
  Delete,
  Post,
  Body,
  Put,
  Patch,
  ValidationPipe,
  Query,
  Req,
  Res,
  Param,
  UseGuards,
  UseInterceptors,
  UploadedFile,
  UploadedFiles,
} from '@nestjs/common';
import { request } from 'http';
import { PromotionService } from './promotion.service';
import { CouponsService } from 'src/coupons/coupons.service';
import { toBase64 } from 'utils/common';
import { AuthGuard } from '@nestjs/passport';
import { Roles } from '../auth/roles.decorator';
import { Role } from '../auth/role.enum';
import { FileInterceptor, FilesInterceptor, FileFieldsInterceptor } from '@nestjs/platform-express'
import { ApiBody } from '@nestjs/swagger';
import { ApiTags, ApiProperty, ApiSecurity, ApiBearerAuth, ApiParam, ApiConsumes, ApiOperation } from '@nestjs/swagger';
import { response } from 'express';
@Controller('promotion')
export class PromotionController {
  constructor(private PromotionService: PromotionService) {}

  ///{get AllPromotion here}
  @Get('/allPromotions')
  async getAllPromotions(@Request() request) {
    return await this.PromotionService.getAllPromotion(request.user);
  }

  //{get SinglePromotionBYId here}
  @Get('/SinglePromotion/:id')
  async getSinglePromotion(@Param() params, @Request() request) {
    return await this.PromotionService.getPromotionbyId(
      params.id,
      request.user,
    );
  }

  //{update promotion by id here}
  @Put('/updatePromotion/:id')
  async updatePromotion(@Param() params, @Request() request) {
    return await this.PromotionService.updatePromotion(
      params.id,
      request.body,
      request.user,
    );
  }
  @Patch('/applyPromotion/:coupon_id')
  async applyPromotion(@Param() params, @Request() request) {
    return await this.PromotionService.applyPromotion(
      params.coupon_id,
      request.body,
      request.user,
    );
  }
  ////delete
  @Delete('/deletePromotion/:id')
  async deleteCoupon(@Param() params, @Request() request) {
    return await this.PromotionService.deletePromotion(params.id);
  }

  //{create promotion}
  @UseGuards(AuthGuard('jwt'))
  @Roles(Role.ADMIN)
  @Post('/addPromotions')
  @UseInterceptors(FileInterceptor('image'))
  @ApiBody({
    schema: {
      type: 'object',
      properties: {},
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
    return await this.PromotionService.createPromotion(
      request.body,
      request.user,
    );
  }
}
