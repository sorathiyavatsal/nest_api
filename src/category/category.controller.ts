import {
  Controller,
  Post,
  UseGuards,
  Request,
  Get,
  UseInterceptors,
  UploadedFiles,
  Response,
  Param,
  Put,
  Delete,
  Query,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { FilesInterceptor } from '@nestjs/platform-express';
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
import { imageFileFilter } from 'src/delivery_fleet/deliveryfleet.controller';
import { diskStorage } from 'multer';
import { CategoryService } from './category.service';
import { response } from 'express';

@Controller('category')
@ApiTags('Category')
@ApiBearerAuth()
@ApiSecurity('api_key')
export class CategoryController {
  constructor(private CategoryService: CategoryService) {}

  @Get('/all/:status')
  @UseGuards(AuthGuard('jwt'))
  @Roles('ADMIN')
  @ApiQuery({ name: 'status', type: 'boolean', required: false })
  async getAllCategory(@Request() request, @Response() response,@Query() query) {
    response.json(await this.CategoryService.getAllCategory(query));
  }

  @Get('/:id')
  @UseGuards(AuthGuard('jwt'))
  @Roles('ADMIN')
  @ApiParam({ name: 'id', required: true })
  async getCategory(@Param() params, @Response() response) {
    response.json(await this.CategoryService.getCategory(params.id));
  }

  @Get('/getByType/:type/:name')
  @UseGuards(AuthGuard('jwt'))
  @Roles('ADMIN')
  @ApiQuery({ name: 'type', type: 'string', required: true })
  @ApiQuery({ name: 'name', type: 'string', required: false })
  async getTypeCategory(@Query() query, @Response() response) {
    response.json(await this.CategoryService.getTypeCategory(query));
  }

  @Post('/add')
  @UseGuards(AuthGuard('jwt'))
  @UseInterceptors(
    FilesInterceptor('categoryImage', 20, {
      storage: diskStorage({
        destination: './public/uploads/category',
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
        categoryName: {
          type: 'string',
        },
        categoryImage: {
          type: 'string',
          format: 'binary',
        },
        categoryType: {
          type: 'string',
        },
        description: {
          type: 'string',
        },
        parent: {
          type: 'string',
        },
        status: {
          type: 'boolean',
        },
      },
    },
  })
  @ApiConsumes('multipart/form-data', 'application/json')
  async postCategory(@Request() request, @UploadedFiles() files) {
    const response = [];
    if (files && files.length > 0) {
      files.forEach((file) => {
        const fileReponse = file.path;
        response.push(fileReponse);
      });
    }
    request.body.categoryImage = response[0];

    return await this.CategoryService.postCategory(request.body);
  }

  @Put('/update:id')
  @UseGuards(AuthGuard('jwt'))
  @UseInterceptors(
    FilesInterceptor('categoryImage', 20, {
      storage: diskStorage({
        destination: './public/uploads/category',
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
        categoryName: {
          type: 'string',
        },
        categoryImage: {
          type: 'string',
          format: 'binary',
        },
        categoryType: {
          type: 'string',
        },
        description: {
          type: 'string',
        },
        parent: {
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
  async putCategory(
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
    request.body.categoryImage = responsedata[0];
    response.json(
      await this.CategoryService.putCategory(request.body, params.id),
    );
  }

  @Delete('/delete:id')
  @UseGuards(AuthGuard('jwt'))
  @ApiConsumes('multipart/form-data', 'application/json')
  @ApiParam({ name: 'id', required: true })
  async deleteBrand(@Param() params, @Request() request, @Response() response) {
    response.json(await this.CategoryService.deleteCategory(params.id));
  }
}
