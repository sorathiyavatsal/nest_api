import { Controller, Post, UseGuards, Request, Get } from '@nestjs/common';
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

@Controller('product')
@ApiTags('Product')
@ApiBearerAuth()
@ApiSecurity('api_key')
export class ProductController {
  constructor(private ProductService: ProductService) {}

  @Get('/all')
  @UseGuards(AuthGuard('jwt'))
  @Roles('ADMIN')
  async getAllProducts(@Request() request) {
    return await this.ProductService.getAllProducts();
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
        variant: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              size: {
                type: 'string',
              },
              price: {
                type: 'number',
              },
              quantity: {
                type: 'number',
              },
            },
          },
        },
        pageTitle: {
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
        category: {
          type: 'array',
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
