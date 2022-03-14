import {
  Controller,
  Post,
  UseGuards,
  Request,
  Get,
  Param,
  Put,
  Response,
  Delete,
  UseInterceptors,
  UploadedFiles,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { FilesInterceptor } from '@nestjs/platform-express';
import {
  ApiBearerAuth,
  ApiBody,
  ApiConsumes,
  ApiParam,
  ApiSecurity,
  ApiTags,
} from '@nestjs/swagger';
import { Roles } from 'src/auth/roles.decorator';
import { BrandService } from './brand.service';
import { diskStorage } from 'multer';
import { imageFileFilter } from 'src/delivery_fleet/deliveryfleet.controller';

@Controller('brand')
@ApiTags('Brand')
@ApiBearerAuth()
@ApiSecurity('api_key')
export class BrandController {
  constructor(private BrandService: BrandService) {}

  @Get('/all')
  @UseGuards(AuthGuard('jwt'))
  async getAllBrand(@Response() response) {
    response.json(await this.BrandService.getAllBrand());
  }

  @Get('/:id')
  @UseGuards(AuthGuard('jwt'))
  @ApiParam({ name: 'id', required: true })
  async getBrand(@Param() params, @Response() response) {
    response.json(await this.BrandService.getBrand(params.id));
  }

  @Post('/add')
  @UseGuards(AuthGuard('jwt'))
  @UseInterceptors(
    FilesInterceptor('brandImage', 20, {
      storage: diskStorage({
        destination: './public/uploads/brands',
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
        brandName: {
          type: 'string',
        },
        brandImage: {
          type: 'string',
          format: 'binary',
        },
        description: {
          type: 'string',
        },
        status: {
          type: 'boolean',
        },
      },
    },
  })
  @ApiConsumes('multipart/form-data', 'application/json')
  async postBrand(@Request() request, @UploadedFiles() files) {
    const response = [];
    if (files && files.length > 0) {
      files.forEach((file) => {
        const fileReponse = file.path;
        response.push(fileReponse);
      });
    }
    request.body.brandImage = response[0];
    return await this.BrandService.postBrand(request.body);
  }

  @Put('/update:id')
  @UseGuards(AuthGuard('jwt'))
  @UseInterceptors(
    FilesInterceptor('brandImage', 20, {
      storage: diskStorage({
        destination: './public/uploads/brands',
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
        brandName: {
          type: 'string',
        },
        brandImage: {
          type: 'string',
          format: 'binary',
        },
        description: {
          type: 'string',
        },
        status: {
          type: 'boolean',
        },
      },
    },
  })
  @ApiConsumes('multipart/form-data', 'application/json')
  @ApiParam({ name: 'id', required: true })
  async putBrand(
    @Param() params,
    @Request() request,
    @Response() response,
    @UploadedFiles() files,
  ) {
    const responsedata = [];
    if (files && files.length > 0) {
      files.forEach((file) => {
        const fileReponse = file.path;
        responsedata.push(fileReponse);
      });
    }
    request.body.brandImage = responsedata[0];
    response.json(await this.BrandService.putBrand(request.body, params.id));
  }

  @Delete('/delete:id')
  @UseGuards(AuthGuard('jwt'))
  @ApiConsumes('multipart/form-data', 'application/json')
  @ApiParam({ name: 'id', required: true })
  async deleteBrand(@Param() params, @Request() request, @Response() response) {
    response.json(await this.BrandService.deleteBrand(params.id));
  }
}
