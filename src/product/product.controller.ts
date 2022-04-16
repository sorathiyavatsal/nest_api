import {
  Controller,
  Post,
  UseGuards,
  Request,
  Get,
  Response,
  UseInterceptors,
  UploadedFiles,
  Put,
  Param,
  Delete,
  Query,
  Patch,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import {
  ApiBearerAuth,
  ApiBody,
  ApiConsumes,
  ApiParam,
  ApiQuery,
  ApiSecurity,
  ApiTags,
} from '@nestjs/swagger';
import { Roles } from 'src/auth/roles.decorator';
import { ProductService } from './product.service';
import { diskStorage } from 'multer';
import { FilesInterceptor } from '@nestjs/platform-express';
import { imageFileFilter } from 'src/delivery_fleet/deliveryfleet.controller';
import { query } from 'express';
@Controller('product')
@ApiTags('Product')
@ApiBearerAuth()
@ApiSecurity('api_key')
export class ProductController {
  constructor(private ProductService: ProductService) {}

  @Get('/all')
  @UseGuards(AuthGuard('jwt'))
  @ApiQuery({ name: 'category', type: 'string', required: false })
  @ApiQuery({ name: 'store', type: 'string', required: false })
  @ApiQuery({ name: 'collection', type: 'string', required: false })
  @ApiQuery({ name: 'name', type: 'string', required: false })
  @ApiQuery({ name: 'title', type: 'string', required: false })
  @ApiQuery({ name: 'page', type: 'number', required: false })
  @ApiQuery({ name: 'limit', type: 'number', required: false })
  async getAllProducts(
    @Request() request,
    @Response() response,
    @Query() query,
  ) {
    response.json(await this.ProductService.getAllProducts(query));
  }

  @Get('/filter')
  @UseGuards(AuthGuard('jwt'))
  @ApiQuery({ name: 'storeCategory', type: 'string', required: false })
  @ApiQuery({ name: 'collection', type: 'string', required: false })
  @ApiQuery({ name: 'category', type: 'string', required: false })
  @ApiQuery({ name: 'brand', type: 'string', required: false })
  @ApiQuery({ name: 'name', type: 'string', required: false })
  @ApiQuery({ name: 'keywords', type: 'string', required: false })
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
    enum: ['NAME', 'DATE', 'PRICE'],
  })
  async getFilterProducts(
    @Request() request,
    @Response() response,
    @Query() query,
  ) {
    response.json(await this.ProductService.getFilterProducts(query));
  }

  @Get('/:id')
  @UseGuards(AuthGuard('jwt'))
  @ApiParam({ name: 'id', type: 'string', required: true })
  async getProducts(@Param() params, @Response() response) {
    response.json(await this.ProductService.getProducts(params.id));
  }

  @Post('/Id')
  async getProductId(@Response() response) {
    response.json(await this.ProductService.getProductId());
  }

  @Post('/options')
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
        productId: {
          type: 'string',
        },
        optionName: {
          type: 'string',
        },
        optionValue: {
          type: 'array',
          items: {
            type: 'string',
          },
        },
        image: {
          type: 'string',
          format: 'binary',
        },
      },
    },
  })
  @ApiConsumes('multipart/form-data', 'application/json')
  async postVariant(@Request() request, @UploadedFiles() files) {
    const response = [];
    if (files && files.length > 0) {
      files.forEach((file) => {
        const fileReponse = file.path;
        response.push(fileReponse);
      });
    }
    request.body.image = response[0];
    return await this.ProductService.postVariant(request.body);
  }

  @Patch('/options')
  @UseGuards(AuthGuard('jwt'))
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        options: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              _id: { type: 'string' },
              optionName: { type: 'string' },
              optionValue: {
                type: 'array',
              },
              optionImage: { type: 'string' },
            },
            example: {
              _id: '6254e9c202079c6aa83604c6',
              optionName: 'size',
              optionValue: ['small', 'medium'],
              optionImage:
                'public/uploads/product/variants/image-1648417148751.jpeg',
            },
          },
        },
      },
    },
  })
  @ApiQuery({ name: 'productId', type: 'string', required: false })
  @ApiConsumes('multipart/form-data', 'application/json')
  async patchVariantOptions(
    @Query() query,
    @Request() request,
    @UploadedFiles() files,
  ) {
      console.log("yre")
    return await this.ProductService.patchVariantOptions(
      query.productId,
      request.body,
    );
  }

  @Delete('/options')
  @UseGuards(AuthGuard('jwt'))
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        productId: {
          type: 'string',
        },
        optionId: {
          type: 'string',
        },
      },
    },
  })
  @ApiConsumes('multipart/form-data', 'application/json')
  async removeVariantOptions(@Request() request) {
    return await this.ProductService.removeVariantOptions(request.body);
  }

  @Post('/variants')
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
        productId: {
          type: 'string',
        },
        parentMetaId: {
          type: 'string',
        },
        options: {
          type: 'object',
        },
        optionsImage: {
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
  async postVariantOptions(@Request() request, @UploadedFiles() files) {
    const response = [];
    if (files && files.length > 0) {
      files.forEach((file) => {
        const fileReponse = file.path;
        response.push(fileReponse);
      });
    }
    request.body.optionsImage = response;

    return await this.ProductService.postVariantOptions(request.body);
  }

  @Patch('/variants')
  @UseGuards(AuthGuard('jwt'))
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        variants: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              _id: { type: 'string' },
              options: { type: 'object' },
              optionImage: { type: 'array' },
            },
            example: {
              _id: '6254e9c202079c6aa83604c6',
              options: { size: 'medium', color: 'red' },
              optionsImage: [
                'public/uploads/product/variants/optionsImage-1648417933409.jpeg',
              ],
            },
          },
        },
      },
    },
  })
  @ApiQuery({ name: 'productId', type: 'string', required: false })
  @ApiConsumes('multipart/form-data', 'application/json')
  async patchVariant(
    @Query() query,
    @Request() request,
    @UploadedFiles() files,
  ) {
    return await this.ProductService.patchVariant(
      query.productId,
      request.body,
    );
  }

  @Delete('/variants')
  @UseGuards(AuthGuard('jwt'))
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        productId: {
          type: 'string',
        },
        variantId: {
          type: 'string',
        },
      },
    },
  })
  @ApiConsumes('multipart/form-data', 'application/json')
  async removeVariant(@Request() request) {
    return await this.ProductService.removeVariant(request.body);
  }

  @Post('/add')
  @UseGuards(AuthGuard('jwt'))
  @UseInterceptors(
    FilesInterceptor('productImage', 20, {
      storage: diskStorage({
        destination: './public/uploads/product',
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
        productId: {
          type: 'string',
        },
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
        metaOptions: {
          type: 'string',
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
        storeCategory: {
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
        keywords: {
          type: 'string',
        },
        menu: {
          type: 'string',
        },
        addon: {
          type: 'array',
          items: {
            type: 'string',
          },
        },
        status: {
          type: 'boolean',
        },
      },
    },
  })
  @ApiConsumes('multipart/form-data', 'application/json')
  async postProduct(@Request() request, @UploadedFiles() files) {
    const response = [];
    if (files && files.length > 0) {
      files.forEach((file) => {
        const fileReponse = file.path;
        response.push(fileReponse);
      });
    }
    request.body.productImage = response;
    return await this.ProductService.postProduct(request.body);
  }

  @Put('/update/:id')
  @UseGuards(AuthGuard('jwt'))
  @UseInterceptors(
    FilesInterceptor('productImage', 20, {
      storage: diskStorage({
        destination: './public/uploads/product',
        filename: function (req, file, cb) {
          let extArray = file.mimetype.split('/');
          let extension = extArray[extArray.length - 1];
          cb(null, file.fieldname + '-' + Date.now() + '.' + extension);
        },
      }),
      fileFilter: imageFileFilter,
    }),
  )
  @ApiParam({ name: 'id', type: 'string', required: true })
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
        metaOptions: {
          type: 'string',
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
        storeCategory: {
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
        keywords: {
          type: 'string',
        },
        menu: {
          type: 'string',
        },
        type: {
          type: 'string',
          enum: ['product', 'addon'],
        },
        parentId: {
          type: 'string',
        },
        status: {
          type: 'boolean',
        },
      },
    },
  })
  @ApiConsumes('multipart/form-data', 'application/json')
  async putProduct(
    @Param() params,
    @Request() request,
    @UploadedFiles() files,
  ) {
    const response = [];
    if (files && files.length > 0) {
      files.forEach((file) => {
        const fileReponse = file.path;
        response.push(fileReponse);
      });
    }
    request.body.productImage = response;
    return await this.ProductService.putProduct(request.body, params.id);
  }

  @Delete('/delete/:id')
  @UseGuards(AuthGuard('jwt'))
  @ApiParam({ name: 'id', type: 'string', required: true })
  @ApiConsumes('multipart/form-data', 'application/json')
  async deleteProduct(@Param() params) {
    return await this.ProductService.deleteProduct(params.id);
  }
}
