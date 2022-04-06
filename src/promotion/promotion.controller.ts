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

@Controller('promotion')
@ApiTags('Promotion')
@ApiBearerAuth()
@ApiSecurity('api_key')
export class PromotionController {
  constructor(private PromotionService: PromotionService) {}
  
  @Get('/id')
  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'))
  async getPromotionId(@Request() req) {
    return await this.PromotionService.getAllPromotion(req);
  }

  @Get('/ads')
  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'))
  @ApiQuery({ name: 'promotionId', type: 'string', required: false })
  async getPromitionAds(@Request() req) {
    return await this.PromotionService.getAllPromotion(req);
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
        title: {
          type: 'string',
        },
        description: {
          type: 'string',
        },
        expiryDate: {
          type: 'array',
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
  async postPromotion(@Request() request, @UploadedFiles() files) {
    const response = [];
    if (files && files.length > 0) {
      files.forEach((file) => {
        const fileReponse = file.path;
        response.push(fileReponse);
      });
    }
    request.body.image = response[0];
    return await this.PromotionService.createPromotion(request.body);
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
        title: {
          type: 'string',
        },
        description: {
          type: 'string',
        },
        expiryDate: {
          type: 'array',
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
  async patchPromotion(@Request() request, @UploadedFiles() files) {
    const response = [];
    if (files && files.length > 0) {
      files.forEach((file) => {
        const fileReponse = file.path;
        response.push(fileReponse);
      });
    }
    request.body.image = response[0];
    return await this.PromotionService.createPromotion(request.body);
  }

  @Delete('/ads')
  @UseGuards(AuthGuard('jwt'))
  @ApiConsumes('multipart/form-data', 'application/json')
  @ApiQuery({ name: 'adsId', type: 'string', required: false })
  async deletePromotion(@Request() request, @UploadedFiles() files) {
    return await this.PromotionService.createPromotion(request.body);
  }
}
