import {
  Controller,
  Get,
  Post,
  Delete,
  Body,
  Put,
  Request,
  Response,
  Param,
  UseGuards,
  UseInterceptors,
  UploadedFile,
  UploadedFiles,
  Query,
  Patch,
} from '@nestjs/common';
import {
  ApiTags,
  ApiSecurity,
  ApiBearerAuth,
  ApiParam,
  ApiConsumes,
  ApiOperation,
  ApiBody,
  ApiQuery,
} from '@nestjs/swagger';
import { CatalogueService } from './catalogue.service';
import { AuthGuard } from '@nestjs/passport';
import { Roles } from '../auth/roles.decorator';
import { catalogueDto } from './dto/catalogue.dto';
import { FilesInterceptor } from '@nestjs/platform-express';
import { imageFileFilter } from 'src/delivery_fleet/deliveryfleet.controller';
import { diskStorage } from 'multer';
import { updateCatalogueDto } from './dto/update-catalogue.dto';

@Controller('catalogue')
@ApiTags('Catalogue')
@ApiBearerAuth()
@ApiSecurity('api_key')
export class CatalogueController {
  constructor(private catalogueService: CatalogueService) {}

  @Post('/Id')
  async getcatalogueId(@Response() response) {
    response.json(await this.catalogueService.getcatalogueId());
  }

  @Post('/options')
  @UseGuards(AuthGuard('jwt'))
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        catalogueId: {
          type: 'string',
        },
        optionName: {
          type: 'string',
        },
        optionValue: {
          type: 'array',
        },
        image: {
          type: 'string',
        },
      },
    },
  })
  @ApiConsumes('multipart/form-data', 'application/json')
  async postVariant(@Request() request) {
    return await this.catalogueService.postVariant(request.body);
  }

  @Post('/variants')
  @UseGuards(AuthGuard('jwt'))
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        catalogueId: {
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
          },
        },
        mrpprice: {
          type: 'number',
        },
        salepprice: {
          type: 'number',
        },
        qty: {
          type: 'number',
        },
        discount: {
          type: 'object',
        },
        unitWight: {
          type: 'string',
        },
        pics: {
          type: 'string',
        },
      },
    },
  })
  @ApiConsumes('multipart/form-data', 'application/json')
  async postVariantOption(@Request() request) {
    return await this.catalogueService.postVariantOption(request.body);
  }

  @ApiOperation({ summary: 'Get All Catalgoue' })
  @UseGuards(AuthGuard('jwt'))
  @ApiQuery({ name: 'storeCategoryName', type: 'string', required: false })
  @ApiQuery({ name: 'collectionName', type: 'string', required: false })
  @ApiQuery({ name: 'categoryName', type: 'string', required: false })
  @ApiQuery({ name: 'storeId', type: 'string', required: false })
  @ApiQuery({ name: 'brandName', type: 'string', required: false })
  @ApiQuery({ name: 'productId', type: 'string', required: false })
  @ApiQuery({ name: 'minprice', type: 'string', required: false })
  @ApiQuery({ name: 'maxprice', type: 'string', required: false })
  @ApiQuery({ name: 'keywords', type: 'string', required: false })
  @ApiQuery({ name: 'catalogueId', type: 'string', required: false })
  @ApiQuery({ name: 'page', type: 'number', required: false })
  @ApiQuery({ name: 'limit', type: 'number', required: false })
  @ApiQuery({ name: 'lat', type: 'string', required: false })
  @ApiQuery({ name: 'lng', type: 'string', required: false })
  @ApiQuery({ name: 'radius', type: 'number', required: false })
  @ApiQuery({ name: 'review', type: 'number', required: false })
  @Get('/all')
  async getFiltercatalogue(@Request() req, @Query() query) {
    return await this.catalogueService.getFiltercatalogue(query);
  }

  @ApiOperation({ summary: 'Get All Catalgoue' })
  @UseGuards(AuthGuard('jwt'))
  @Get('/filter')
  @ApiQuery({ name: 'storeCategoryName', type: 'string', required: false })
  @ApiQuery({ name: 'collectionName', type: 'string', required: false })
  @ApiQuery({ name: 'categoryName', type: 'string', required: false })
  @ApiQuery({ name: 'storeId', type: 'string', required: false })
  @ApiQuery({ name: 'brandName', type: 'string', required: false })
  @ApiQuery({ name: 'productId', type: 'string', required: false })
  @ApiQuery({ name: 'minprice', type: 'string', required: false })
  @ApiQuery({ name: 'maxprice', type: 'string', required: false })
  @ApiQuery({ name: 'keywords', type: 'string', required: false })
  @ApiQuery({ name: 'catalogueId', type: 'string', required: false })
  @ApiQuery({ name: 'page', type: 'number', required: false })
  @ApiQuery({ name: 'limit', type: 'number', required: false })
  @ApiQuery({ name: 'lat', type: 'string', required: false })
  @ApiQuery({ name: 'lng', type: 'string', required: false })
  @ApiQuery({ name: 'radius', type: 'number', required: false })
  @ApiQuery({ name: 'review', type: 'number', required: false })
  async getFilter(@Request() req, @Query() query) {
    return await this.catalogueService.getFilter(query);
  }

//   @ApiOperation({ summary: 'Get Catalogue By Id' })
//   @UseGuards(AuthGuard('jwt'))
//   @ApiQuery({ name: 'storeid', required: true })
//   @ApiQuery({ name: 'productid', required: false })
//   @ApiConsumes('multipart/form-data', 'application/json')
//   @Get('/')
//   async getcatalogueById(@Query() query, @Request() req) {
//     return await this.catalogueService.getcatalogueById(query);
//   }

  @ApiOperation({ summary: 'Get Catalogue By Id' })
  @UseGuards(AuthGuard('jwt'))
  @ApiQuery({ name: 'id', required: true })
  @ApiConsumes('multipart/form-data', 'application/json')
  @Get('/id')
  async getcatalogue(@Query() query, @Request() req) {
    return await this.catalogueService.getcatalogue(query);
  }

  @ApiOperation({ summary: 'Add Catalogue' })
  @UseGuards(AuthGuard('jwt'))
  @ApiConsumes('multipart/form-data', 'application/json')
  @Post('/')
  async addNewcatalogue(@Body() catalogue: catalogueDto, @Request() req) {
    return await this.catalogueService.addNewcatalogue(catalogue);
  }

  @ApiOperation({ summary: 'Update Catalogue' })
  @UseGuards(AuthGuard('jwt'))
  @ApiParam({ name: 'id', required: true })
  @ApiConsumes('multipart/form-data', 'application/json')
  @Put('/:id')
  async updatecatalogue(
    @Param() params,
    @Body() updatecatalogue: updateCatalogueDto,
    @Request() req,
  ) {
    return await this.catalogueService.updatecatalogue(
      params.id,
      updatecatalogue,
    );
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
  @ApiQuery({ name: 'catalogueId', type: 'string', required: false })
  @ApiConsumes('multipart/form-data', 'application/json')
  async patchVariantOptions(@Query() query, @Request() request) {
    return await this.catalogueService.patchVariantOptions(
      query.catalogueId,
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
    return await this.catalogueService.removeVariantOptions(request.body);
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
  @ApiQuery({ name: 'catalogueId', type: 'string', required: false })
  @ApiConsumes('multipart/form-data', 'application/json')
  async patchVariant(@Query() query, @Request() request) {
    return await this.catalogueService.patchVariant(
      query.catalogueId,
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
    return await this.catalogueService.removeVariant(request.body);
  }
}
