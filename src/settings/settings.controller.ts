import { Controller, SetMetadata, Request,Get, Post, Body, Delete, Put, ValidationPipe, Query, Req, Res, Param, UseGuards, UseInterceptors, UploadedFile } from '@nestjs/common';
import { SettingsService} from "./setting.service"
import { ApiTags, ApiProperty, ApiSecurity, ApiBearerAuth,ApiParam,ApiConsumes,  ApiOperation } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { User } from "../auth/user.model";
import { userInfo } from 'os';
import { Roles } from '../auth/roles.decorator';
import { Role } from '../auth/role.enum';
import { CreateSettingsDto } from './dto/create-settings';
import { EditSettingsDto } from './dto/edit-settings';
import {FileInterceptor,FilesInterceptor,FileFieldsInterceptor} from '@nestjs/platform-express'
import { ApiBody } from '@nestjs/swagger';
import { diskStorage } from 'multer';
import { extname } from 'path';

@Controller('settings')
@ApiTags('Settings')
@ApiBearerAuth()
@UseGuards(AuthGuard('jwt'))
@Roles(Role.ADMIN)

export class SettingsController {
    constructor(private securityService: SettingsService) { }
  
  @Get('/all')
  async getCategories(@Request() request) {
    
    return await this.securityService.getAllCustomers(request.user);
  }
  @ApiParam({name: 'id', required: true})
  @Get('/settings/:id')
  async getCategoryDetail(@Param() params,@Request() request:any) {
   
    return await this.securityService.getCategoryDetail(params.id);
  }
  @Post('/add')
  @UseInterceptors(
    FilesInterceptor('image', 20, {
      storage: diskStorage({
        destination: './public/uploads'
        
      })
    }),
  )
  async addCategories(@Body()  createSecurityDto: CreateSettingsDto,@Request() request) {
   
    return await this.securityService.createCategory(createSecurityDto,request.user);
  }
  @ApiParam({name: 'id', required: true})
  @Put('/update/:id')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        name: {type:'string'},
        activeStatus: {type:'boolean'},
        
        image: {
          
          type: 'string',
          items: {
            type: 'string',
            format: 'binary',
          },
        },
        
      },
    },
  })
  @ApiConsumes('multipart/form-data')
  async updateCategories(@Param() params,@Body()  editSecurityDto: EditSettingsDto,@Request() request:any) {
   
    return await this.securityService.updateCategory(params.id,editSecurityDto,request.user);
  }
  @ApiParam({name: 'id', required: true})
  @Delete('/delete/:id')
  async deleteCategories(@Param() params,@Request() request:any) {
   return await this.securityService.deleteSettings(params.id);
  }
}
