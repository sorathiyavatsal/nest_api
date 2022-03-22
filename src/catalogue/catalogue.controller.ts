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

  @Post('/variants')
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
    request.body.metaImage = response[0];

    return await this.catalogueService.postVariant(request.body);
  }

  @Post('/variants/option')
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
            format: 'binary',
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
  async postVariantOptions(@Request() request, @UploadedFiles() files) {
    const response = [];
    if (files && files.length > 0) {
      files.forEach((file) => {
        const fileReponse = file.path;
        response.push(fileReponse);
      });
    }
    request.body.optionsImage = response;
    return await this.catalogueService.postVariantOptions(request.body);
  }

  @ApiOperation({ summary: 'Get All Catalgoue' })
  @UseGuards(AuthGuard('jwt'))
  @Get('/all')
  async getAllcatalogue(@Request() req) {
    return await this.catalogueService.getAllcatalogue();
  }

  @ApiOperation({ summary: 'Get All Catalgoue' })
  @UseGuards(AuthGuard('jwt'))
  @Get('/filter')
  @ApiQuery({ name: 'storeCategory', type: 'string', required: false })
  @ApiQuery({ name: 'collection', type: 'string', required: false })
  @ApiQuery({ name: 'category', type: 'string', required: false })
  @ApiQuery({ name: 'store', type: 'string', required: false })
  @ApiQuery({ name: 'brand', type: 'string', required: false })
  @ApiQuery({ name: 'name', type: 'string', required: false })
  @ApiQuery({ name: 'minprice', type: 'string', required: false })
  @ApiQuery({ name: 'maxprice', type: 'string', required: false })
  @ApiQuery({ name: 'keywords', type: 'string', required: false })
  @ApiQuery({ name: 'catalogue', type: 'string', required: false })
  @ApiQuery({ name: 'page', type: 'number', required: true })
  @ApiQuery({ name: 'limit', type: 'number', required: true })
  async getFiltercatalogue(@Request() req, @Query() query) {
    return await this.catalogueService.getFiltercatalogue(query);
  }

  @ApiOperation({ summary: 'Get Catalogue By Id' })
  @UseGuards(AuthGuard('jwt'))
  @ApiQuery({ name: 'storeid', required: true })
  @ApiQuery({ name: 'productid', required: false })
  @ApiConsumes('multipart/form-data', 'application/json')
  @Get('/')
  async getcatalogueById(@Query() query, @Request() req) {
    return await this.catalogueService.getcatalogueById(query);
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
    @Body() catalogue: catalogueDto,
    @Request() req,
  ) {
    return await this.catalogueService.updatecatalogue(params.id, catalogue);
  }
}
