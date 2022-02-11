import {
  Controller,
  SetMetadata,
  Request,
  Get,
  Post,
  Body,
  Put,
  ValidationPipe,
  Query,
  Req,
  Res,
  Param,
  UseGuards,
  UseInterceptors,
  UploadedFile,
  UploadedFiles,
} from '@nestjs/common';
import { GoodsService } from './goods.service';
import {
  ApiTags,
  ApiProperty,
  ApiSecurity,
  ApiBearerAuth,
  ApiParam,
  ApiConsumes,
  ApiOperation,
} from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { User } from '../auth/user.model';
import { userInfo } from 'os';
import { Roles } from '../auth/roles.decorator';
import { Role } from '../auth/role.enum';
import { CreateGoodsDto } from './dto/create-goods';
import { EditGoodsDto } from './dto/edit-goods';
import {
  FileInterceptor,
  FilesInterceptor,
  FileFieldsInterceptor,
} from '@nestjs/platform-express';
import { ApiBody } from '@nestjs/swagger';
import { diskStorage } from 'multer';
import { toBase64 } from 'utils/common';
import { extname } from 'path';
const path = require('path');

@Controller('goods')
@ApiTags('Goods')
@ApiBearerAuth()
@ApiSecurity('api_key')
export class GoodsController {
  constructor(private securityService: GoodsService) {}

  @Get('/all')
  async getGoods(@Request() request) {
    return await this.securityService.getAllGoods(request.user);
  }
  @Get('/active-goods')
  async getActiveGoods(@Request() request) {
    return await this.securityService.getActiveGoods(request.user);
  }
  @ApiParam({ name: 'id', required: true })
  @Get('/goods/:id')
  async getGoodsDetail(@Param() params, @Request() request: any) {
    console.log('weclome' + params.id);
    return await this.securityService.getGoodsDetail(params.id);
  }
  @UseGuards(AuthGuard('jwt'))
  @Roles(Role.ADMIN)
  @ApiConsumes('multipart/form-data', 'application/json')
  @Post('/add')
  @UseInterceptors(
    FileInterceptor('image', {
      // storage: diskStorage({
      //   destination: './public/uploads/goods',
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
  @ApiConsumes('multipart/form-data', 'application/json')
  @ApiOperation({
    summary:
      'please try here https://documenter.getpostman.com/view/811020/UVC9hkcP',
  })
  async addGoods(@UploadedFile() file, @Request() request) {
    if (file) {
      request.body.image = await toBase64(file);
    }
    console.log('boydydyddyd', request.body);
    return await this.securityService.createGoods(request.body, request.user);
  }
  @UseGuards(AuthGuard('jwt'))
  @Roles(Role.ADMIN)
  @ApiParam({ name: 'id', required: true })
  @ApiConsumes('multipart/form-data', 'application/json')
  @Put('/update/:id')
  @UseInterceptors(
    FileInterceptor('image', {
      // storage: diskStorage({
      //   destination: './public/uploads/goods',
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
  @ApiConsumes('multipart/form-data', 'application/json')
  async updateGoods(
    @UploadedFile() file,
    @Param() params,
    @Request() request: any,
  ) {
    if (file) {
      request.body.image = await toBase64(file);
    }
    return await this.securityService.updateGoods(
      params.id,
      request.body,
      request.user,
    );
  }
  @UseGuards(AuthGuard('jwt'))
  @Roles(Role.ADMIN)
  @ApiParam({ name: 'id', required: true })
  @Get('/delete-goods/:id')
  async deleteGoods(
    @Param() params,
    @Body() editSecurityDto: EditGoodsDto,
    @Request() request: any,
  ) {
    return await this.securityService.updateGoods(
      params.id,
      editSecurityDto,
      request.user,
    );
  }
}

export const editFileName = (req, file, callback) => {
  const name = file.originalname.split('.')[0];
  const randomName = Array(4)
    .fill(null)
    .map(() => Math.round(Math.random() * 16).toString(16))
    .join('');
  callback(null, `${name}-${randomName}.${path.extname(file.originalname)}`);
};
