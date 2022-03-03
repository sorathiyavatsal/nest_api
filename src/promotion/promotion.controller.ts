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
import {
  FileInterceptor,
  FilesInterceptor,
  FileFieldsInterceptor,
} from '@nestjs/platform-express';
import { ApiBody, ApiQuery } from '@nestjs/swagger';
import {
  ApiTags,
  ApiProperty,
  ApiSecurity,
  ApiBearerAuth,
  ApiParam,
  ApiConsumes,
  ApiOperation,
} from '@nestjs/swagger';
import { response } from 'express';
import Api from 'twilio/lib/rest/Api';
@Controller('promotion')
@ApiTags('Promotion')
@ApiBearerAuth()
@ApiSecurity('api_key')
export class PromotionController {
  constructor(private PromotionService: PromotionService) {}

  ///{get AllPromotion here}
  @ApiOperation({summary:"in this section you can get all the promotions existing in database by simply clicking on execute button"})

  @Get('/')
  async getAllPromotions(@Request() request) {
    return await this.PromotionService.getAllPromotion(request.user);
  }
  ///{get User Promotions here}
  @ApiBody({
    schema:{
      properties:{
         promotion_target_location:{type:'String'},
          promotion_target_gender:{type:'String'},
           promotion_target_age:{type:'String'}
      }
    }
  })
  @ApiOperation({summary:"in this section we can get promotion on the bases of age/gender/location all filters OR you want to get promotion on the bases of just location so you can remove others from body"})
  @Post('/')
  async getUserPromotions(@Request() request) {
    return await this.PromotionService.getPromotionsForUser(request.body);
  }

  //{get SinglePromotionBYId here}
  @ApiParam({name:"id",required:true})
 @ApiOperation({summary:"in this section we can get single promotion on the bases of id. add id into the param section nd this will return promotion based on id"})
  @Get('/:id')
  async getSinglePromotion(@Param() params, @Request() request) {
    return await this.PromotionService.getPromotionbyId(
      params.id,
      request.user,
    );
  }

  //{update promotion by id here}
  @ApiParam({ name: 'id', required: true })
  @ApiConsumes('multipart/form-data', 'application/json')
  @ApiOperation({summary:"update all diffrent sections as their type suggested,provide couponId in params nd that couponId will added into promotion"})
  
  @Put('/:id')
  @ApiBody({  
    schema: {
      properties: {
        promotion_name: { type: 'String' },
        promotion_description: { type: 'String' },
        promotion_image: { type: 'String' },
        promotion_content_type: { type: 'String' },
        promotion_target_type: { type: 'String' },
        promotion_Device_type: { type: 'String' },
        promotion_type: { type: 'String' },
        promotion_target_filters:{ type: 'String' },
        promotion_target_users_by:{ type: 'String' },
        promotion_start_date:{type:'Date'},
        promotion_end_date:{type:'Date'},
        coupon_id:{ type: 'ObjectId' },
        marchent_id:{ type: 'ObjectId' } ,

      },
    },
  })
  async updatePromotion(@Param() params, @Request() request) {
    return await this.PromotionService.updatePromotion(
      params.id,
      request.body,
      request.user,
    );
  }

  @Patch('/:coupon_id')
  @ApiConsumes('multipart/form-data', 'application/json')
  @ApiOperation({summary:"promotion type means it can be flat or percentage"})
  
 
  @ApiParam({name:'coupon_id' ,required:true})
  @ApiBody({
    schema: {
      properties: {
        promotion_type:{type:'string'},
       
        orderPrice:{type:'number'}
      },
    },
  })
  async applyPromotion(@Param() params, @Request() request) {
    return await this.PromotionService.applyPromotion(
      params.coupon_id,
      request.body,
      request.user,
      
    );
  }
 
  ////delete
 @ApiOperation({summary:"delete will work when we put id of object in param section"})
@ApiParam({name:'id',required:true})
@Delete('/:id')
  async deleteCoupon(@Param() params, @Request() request) {
    return await this.PromotionService.deletePromotion(params.id);
  }

  //{create promotion}
  @UseGuards(AuthGuard('jwt'))
  @Roles(Role.ADMIN)
  @Post('/')
  @UseInterceptors(FileInterceptor('image'))
  @ApiBody({  
    schema: {
      properties: {
        promotion_name: { type: 'String' },
        promotion_description: { type: 'String' },
        promotion_image: { type: 'String' },
        promotion_content_type: { type: 'String' },
        promotion_target_type: { type: 'String' },
        promotion_Device_type: { type: 'String' },
        promotion_type: { type: 'String' },
        promotion_target_filters:{ type: 'String' },
        promotion_target_users_by:{ type: 'String' },
        promotion_start_date:{type:'Date'},
        promotion_end_date:{type:'Date'},
        coupon_id:{ type: 'ObjectId' },
        marchent_id:{ type: 'ObjectId' } ,

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
    return await this.PromotionService.createPromotion(
      request.body,
      request.user,
    );
  }
}
