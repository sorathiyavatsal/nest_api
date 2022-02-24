import {
  Controller,
  Post,
  UseGuards,
  Request,
  Get,
  Response,
  UseInterceptors,
  UploadedFiles,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import {
  ApiBearerAuth,
  ApiBody,
  ApiConsumes,
  ApiSecurity,
  ApiTags,
} from '@nestjs/swagger';
import { Roles } from 'src/auth/roles.decorator';
import { ProductService } from './product.service';
import { diskStorage } from 'multer';
import { FilesInterceptor } from '@nestjs/platform-express';
import { imageFileFilter } from 'src/delivery_fleet/deliveryfleet.controller';
@Controller('product')
@ApiTags('Product')
@ApiBearerAuth()
@ApiSecurity('api_key')
export class ProductController {
  constructor(private ProductService: ProductService) {}

  @Get('/all')
  @UseGuards(AuthGuard('jwt'))
  @Roles('ADMIN')
  async getAllProducts(@Request() request, @Response() response) {
    response.json(await this.ProductService.getAllProducts());
  }

  @Post('/meta')
  @UseGuards(AuthGuard('jwt'))
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        metakey: {
          type: 'string',
        },
        metavalue: {
          type: 'string',
        },
        metatype: {
          type: 'boolean',
        },
      },
    },
  })
  @ApiConsumes('multipart/form-data', 'application/json')
  async postVariant(@Request() request) {
    return await this.ProductService.postVariant(request.body);
  }

  @Post('/meta/option')
  @UseGuards(AuthGuard('jwt'))
  @UseInterceptors(
    FilesInterceptor('optionsImage', 20, {
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
        variantId: {
          type: 'string',
        },
        optionsValue: {
          type: 'string',
        },
        optionsImage: {
          type: 'string',
          format: 'binary',
        },
        optionsText: {
          type: 'string',
        },
      },
    },
  })
  @ApiConsumes('multipart/form-data', 'application/json')
  async postVariantOptions(@Request() request, @UploadedFiles() files) {
    const response = [];
    if (files && files.length > 0) {
      files.forEach((file) => {
        const fileReponse = file.path;
        response.push(fileReponse);
      });
    }
    request.body.optionsImage = response[0];
    return await this.ProductService.postVariantOptions(request.body);
  }

  @Post('/add')
  @UseGuards(AuthGuard('jwt'))
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        productName: {
          type: 'string',
        },
        secodary_productName: {
          type: 'string',
        },
        description: {
          type: 'string',
        },
        pageTitle: {
          type: 'string',
        },
        variant: {
          type: 'array',
        },
        metaDescription: {
          type: 'string',
        },
        urlHandle: {
          type: 'string',
        },
        productImage: {
          type: 'array',
          items: {
            type: 'string',
            format: 'binary',
          },
        },
        store: {
          type: 'string',
        },
        category: {
          type: 'string',
        },
        collection: {
          type: 'string',
        },
        brand: {
          type: 'string',
        },
        status: {
          type: 'boolean',
        },
      },
    },
  })
  @ApiConsumes('multipart/form-data', 'application/json')
  async postProduct(@Request() request) {
    return await this.ProductService.postProduct();
  }
}
