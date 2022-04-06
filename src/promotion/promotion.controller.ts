import {
  Controller,
  Post,
  UploadedFiles,
  UseGuards,
  UseInterceptors,
  Request,
  Get,
  Patch,
  Delete,
  Body,
  Param,
  Query,
} from '@nestjs/common';
import { PromotionService } from './promotion.service';
import {
  ApiTags,
  ApiSecurity,
  ApiBearerAuth,
  ApiBody,
  ApiConsumes,
  ApiParam,
  ApiQuery,
} from '@nestjs/swagger';
import { CreatePromotionDto } from './dto/create-promotion';
import { diskStorage } from 'multer';
import { AuthGuard } from '@nestjs/passport';
import { FilesInterceptor } from '@nestjs/platform-express';
import { imageFileFilter } from 'src/delivery_fleet/deliveryfleet.controller';
import { UpdatePromotionDto } from './dto/update-promotion';
import { CreateViewAdsDto } from './dto/view-ads';

@Controller('promotion')
@ApiTags('Promotion')
@ApiBearerAuth()
@ApiSecurity('api_key')
export class PromotionController {
  constructor(private PromotionService: PromotionService) {}

  @Get('/all')
  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'))
  async getPromitionall(@Request() req) {
    return await this.PromotionService.getPromitionall(); 
  }

  @Get('/')
  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'))
  @ApiQuery({ name: 'promotionId', type: 'string', required: false })
  async getPromitionById(@Query() query) {
    return await this.PromotionService.getPromitionById(query.promotionId);
  }

  @Get('/Filter')
  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'))
  @ApiQuery({ name: 'promotionId', type: 'string', required: false })
  @ApiQuery({
    name: 'network',
    enum: ['MARCHANT', 'CONSUMER', 'DELIVERY BOY'],
    type: 'string',
    required: false,
  })
  @ApiQuery({
    name: 'promotionType',
    enum: ['DISPLAY', 'NOTIFICATION', 'MESSAGE'],
    type: 'string',
    required: false,
  })
  @ApiQuery({
    name: 'page',
    enum: ['PAGE1', 'PAGE2', 'PAGE3', 'PAGE4'],
    type: 'string',
    required: false,
  })
  @ApiQuery({
    name: 'user_condition',
    type: 'object',
    example: {
      gender: 'Male',
      age: 0,
    },
    required: false,
  })
  @ApiQuery({
    name: 'device',
    enum: ['MOBILE', 'WEB'],
    type: 'string',
    required: false,
  })
  async getPromitionFilter(@Query() query) {
    return await this.PromotionService.getPromitionFilter(query);
  }

  @Post('/')
  @UseGuards(AuthGuard('jwt'))
  @ApiConsumes('multipart/form-data', 'application/json')
  async postPromotion(@Body() createPromotionDto: CreatePromotionDto) {
    return await this.PromotionService.createPromotion(createPromotionDto);
  }

  @Post('/ads/view')
  @UseGuards(AuthGuard('jwt'))
  @ApiConsumes('multipart/form-data', 'application/json')
  async postViewPromotionAds(@Body() createViewAdsDto: CreateViewAdsDto) {
    return await this.PromotionService.createPromotionAdsView(createViewAdsDto);
  }

  @Patch('/ads')
  @UseGuards(AuthGuard('jwt'))
  @ApiQuery({ name: 'promotionId', type: 'string', required: true })
  @ApiConsumes('multipart/form-data', 'application/json')
  async patchPromotion(
    @Body() updatePromotionDto: UpdatePromotionDto,
    @Query() query,
  ) {
    return await this.PromotionService.updatePromotion(
      query.promotionId,
      updatePromotionDto,
    );
  }

  @Delete('/')
  @UseGuards(AuthGuard('jwt'))
  @ApiConsumes('multipart/form-data', 'application/json')
  @ApiQuery({ name: 'promotionId', type: 'string', required: false })
  async deletePromotion(@Query() query) {
    return await this.PromotionService.deletePromotion(query.promotionId);
  }

  @Post('/ads')
  @UseGuards(AuthGuard('jwt'))
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
        promotionId: {
          type: 'string',
        },
        coupon: {
          type: 'array',
        },
        title: {
          type: 'string',
        },
        description: {
          type: 'string',
        },
        expiryDate: {
          type: 'string',
        },
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
  @ApiConsumes('multipart/form-data', 'application/json')
  async postPromotionAds(@Request() request, @UploadedFiles() files) {
    const response = [];
    if (files && files.length > 0) {
      files.forEach((file) => {
        const fileReponse = file.path;
        response.push(fileReponse);
      });
    }
    request.body.image = response;
    return await this.PromotionService.createPromotionAds(request.body);
  }

  @Patch('/ads')
  @UseGuards(AuthGuard('jwt'))
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
        promotionId: {
          type: 'string',
        },
        coupon: {
          type: 'array',
        },
        title: {
          type: 'string',
        },
        description: {
          type: 'string',
        },
        expiryDate: {
          type: 'string',
        },
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
  @ApiQuery({ name: 'adId', type: 'string', required: true })
  @ApiConsumes('multipart/form-data', 'application/json')
  async patchPromotionAds(
    @Request() request,
    @UploadedFiles() files,
    @Query() query,
  ) {
    const response = [];
    if (files && files.length > 0) {
      files.forEach((file) => {
        const fileReponse = file.path;
        response.push(fileReponse);
      });
    }
    request.body.image = response;
    return await this.PromotionService.updatePromotionAds(
      query.adId,
      request.body,
    );
  }

  @Delete('/ads')
  @UseGuards(AuthGuard('jwt'))
  @ApiConsumes('multipart/form-data', 'application/json')
  @ApiQuery({ name: 'adsId', type: 'string', required: false })
  async deletePromotionAds(@Query() query, @UploadedFiles() files) {
    return await this.PromotionService.deletePromotionAds(query.adsId);
  }
}
