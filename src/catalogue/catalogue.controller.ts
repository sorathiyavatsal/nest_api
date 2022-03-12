import {
  Controller,
  Get,
  Post,
  Delete,
  Body,
  Put,
  Request,
  Param,
  UseGuards,
  UseInterceptors,
  UploadedFile,
  UploadedFiles,
} from '@nestjs/common';
import {
  ApiTags,
  ApiSecurity,
  ApiBearerAuth,
  ApiParam,
  ApiConsumes,
  ApiOperation,
  ApiBody,
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
        name: {
          type: 'string',
        },
        type: {
          type: 'boolean',
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
    console.log(request.body)
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
        mrpprice: {
          type: 'number',
        },
        salepprice: {
          type: 'number',
        },
        qty: {
          type: 'number',
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
    return await this.catalogueService.postVariantOptions(request.body);
  }

  @ApiOperation({ summary: 'Get All Catalgoue' })
  @UseGuards(AuthGuard('jwt'))
  @Roles('ADMIN')
  @Get('/')
  async getAllcatalogue(@Request() req) {
    return await this.catalogueService.getAllcatalogue();
  }

  @ApiOperation({ summary: 'Get Catalogue By Id' })
  @UseGuards(AuthGuard('jwt'))
  @Roles('ADMIN')
  @ApiParam({ name: 'storeid', required: true })
  @ApiParam({ name: 'productid', required: true })
  @ApiConsumes('multipart/form-data', 'application/json')
  @Get('/:storeid/:productid')
  async getcatalogueById(@Param() params, @Request() req) {
    return await this.catalogueService.getcatalogueById(params);
  }

  @ApiOperation({ summary: 'Add Catalogue' })
  @UseGuards(AuthGuard('jwt'))
  @Roles('ADMIN')
  @ApiConsumes('multipart/form-data', 'application/json')
  @Post('/')
  async addNewcatalogue(@Body() catalogue: catalogueDto, @Request() req) {
    return await this.catalogueService.addNewcatalogue(catalogue);
  }

  @ApiOperation({ summary: 'Update Catalogue' })
  @UseGuards(AuthGuard('jwt'))
  @Roles('ADMIN')
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