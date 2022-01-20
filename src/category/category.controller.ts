import { Controller, SetMetadata, Request, Get, Post, Body, Put, ValidationPipe, Query, Req, Res, Param, UseGuards, UseInterceptors, UploadedFile, UploadedFiles } from '@nestjs/common';
import { CategoryService } from "./category.service"
import { ApiTags, ApiProperty, ApiSecurity, ApiBearerAuth, ApiParam, ApiConsumes, ApiOperation } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { User } from "../auth/user.model";
import { userInfo } from 'os';
import { Roles } from '../auth/roles.decorator';
import { Role } from '../auth/role.enum';
import { CreateCategoryDto } from './dto/create-category';
import { EditCategoryDto } from './dto/edit-category';
import { FileInterceptor, FilesInterceptor, FileFieldsInterceptor } from '@nestjs/platform-express'
import { ApiBody } from '@nestjs/swagger';
import { diskStorage } from 'multer';
import { toBase64 } from 'utils/common';
import { extname } from 'path';
const path = require('path');
@Controller('category')
@ApiTags('Goods')
@ApiBearerAuth()
@ApiSecurity('api_key')
export class CategoryController {
  constructor(private securityService: CategoryService) {}

  @Get('/all')
  async getCategories(@Request() request) {
    return await this.securityService.getAllCategory(request.user);
  }
  @Get('/active-categories')
  async getActiveCategories(@Request() request) {
    return await this.securityService.getActiveCategory(request.user);
  }
  @ApiParam({ name: 'id', required: true })
  @Get('/categories/:id')
  async getCategoryDetail(@Param() params, @Request() request: any) {
    console.log('weclome' + params.id);
    return await this.securityService.getCategoryDetail(params.id);
  }
  @UseGuards(AuthGuard('jwt'))
  @Roles(Role.ADMIN)
  @Post('/add')
  @UseInterceptors(
    FileInterceptor('image', {
      // storage: diskStorage({
      //   destination: './public/uploads/category',
      //   filename: function(req, file, cb) {
      //     let extArray = file.mimetype.split('/');
      //     let extension = extArray[extArray.length - 1];
      //     cb(null, file.fieldname + '-' + Date.now() + '.' + extension);
      //   },
      // }),
    }),
  )
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        name: { type: 'string' },
        activeStatus: { type: 'boolean' },

        image: {
          type: 'string',

          format: 'binary',
        },
        orderNumber: { type: 'number' },
      },
    },
  })
  @ApiConsumes('multipart/form-data')
  @ApiOperation({
    summary:
      'please try here https://documenter.getpostman.com/view/811020/UVC9hkcP',
  })
  async addCategories(@UploadedFile() file, @Request() request) {
    if (file) {
      request.body.image = await toBase64(file);
    }
    console.log('boydydyddyd', request.body);
    return await this.securityService.createCategory(
      request.body,
      request.user,
    );
  }
  @UseGuards(AuthGuard('jwt'))
  @Roles(Role.ADMIN)
  @ApiParam({ name: 'id', required: true })
  @Put('/update/:id')
  @UseInterceptors(
    FileInterceptor('image', {
      // storage: diskStorage({
      //   destination: './public/uploads/category',
      //   filename: function(req, file, cb) {
      //     let extArray = file.mimetype.split('/');
      //     let extension = extArray[extArray.length - 1];
      //     cb(null, file.fieldname + '-' + Date.now() + '.' + extension);
      //   },
      // }),
    }),
  )
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        name: { type: 'string' },
        activeStatus: { type: 'boolean' },

        image: {
          type: 'string',

          format: 'binary',
        },
      },
    },
  })
  @ApiOperation({
    summary:
      'please try here https://documenter.getpostman.com/view/811020/UVC9hkcP',
  })
  @ApiConsumes('multipart/form-data')
  async updateCategories(
    @UploadedFile() file,
    @Param() params,
    @Request() request: any,
  ) {
    if (file) {
      request.body.image = await toBase64(file);
    }
    return await this.securityService.updateCategory(
      params.id,
      request.body,
      request.user,
    );
  }
  @UseGuards(AuthGuard('jwt'))
  @Roles(Role.ADMIN)
  @ApiParam({ name: 'id', required: true })
  @Get('/delete-categories/:id')
  async deleteCategories(
    @Param() params,
    @Body() editSecurityDto: EditCategoryDto,
    @Request() request: any,
  ) {
    return await this.securityService.updateCategory(
      params.id,
      editSecurityDto,
      request.user,
    );
  }
}
export const editFileName = (req, file, callback) => {
  const name = file.originalname.split('.')[0];
  const fileExtName = extname(file.originalname);
  const randomName = Array(4)
    .fill(null)
    .map(() => Math.round(Math.random() * 16).toString(16))
    .join('');
  callback(null, `${name}-${randomName}.${path.extname(file.originalname)}`);
};