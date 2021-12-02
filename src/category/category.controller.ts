import { Controller, SetMetadata, Request, Get, Post, Body, Put, ValidationPipe, Query, Req, Res, Param, UseGuards, UseInterceptors, UploadedFile, UploadedFiles } from '@nestjs/common';
import { CategoryService} from "./category.service"
import { ApiTags, ApiProperty, ApiSecurity, ApiBearerAuth,ApiParam,ApiConsumes,  ApiOperation } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { User } from "../auth/user.model";
import { userInfo } from 'os';
import { Roles } from '../auth/roles.decorator';
import { Role } from '../auth/role.enum';
import { CreateCategoryDto } from './dto/create-category';
import { EditCategoryDto } from './dto/edit-category';
import {FileInterceptor,FilesInterceptor,FileFieldsInterceptor} from '@nestjs/platform-express'
import { ApiBody } from '@nestjs/swagger';
import { diskStorage } from 'multer';
import { extname } from 'path';

@Controller('category')
@ApiTags('Category')
@ApiBearerAuth()
@UseGuards(AuthGuard('jwt'))
@Roles(Role.ADMIN)

export class CategoryController {
    constructor(private securityService: CategoryService) { }
  
  @Get('/all')
  async getCategories(@Request() request) {
   return await this.securityService.getAllCategory(request.user);
  }
  @ApiParam({name: 'id', required: true})
  @Get('/categories/:id')
  async getCategoryDetail(@Param() params,@Request() request:any) {
    console.log("weclome"+params.id)
    return await this.securityService.getCategoryDetail(params.id);
  }
  @Post('/add')
  @UseInterceptors(
    FilesInterceptor('image', 20, {
      storage: diskStorage({
        destination: './public/uploads/category'
        
      })
    }),
  )
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        name: {type:'string'},
        activeStatus: {type:'boolean'},
        
        image: {
          
          type: 'string',
          
            format: 'binary',
          
        },
        
      },
    },
  })
  @ApiConsumes('multipart/form-data')
  @ApiOperation({summary:'please try here https://documenter.getpostman.com/view/811020/UVC9hkcP'})
  async addCategories(@UploadedFiles() file,@Request() request) {
    if(file)
    {
      if(file.length>0)
    
      request.body.image= file[0]
      else
      request.body.image= file

     
    }
    return await this.securityService.createCategory(request.body,request.user);
  }
  @ApiParam({name: 'id', required: true})
  @Put('/update/:id')
  @UseInterceptors(
    FilesInterceptor('image', 20, {
      storage: diskStorage({
        destination: './public/uploads/category'
        
      })
    }),
  )
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        name: {type:'string'},
        activeStatus: {type:'boolean'},
        
        image: {
          
          type: 'string',
         
            format: 'binary',
          
        },
        
      },
    },
  })
  @ApiOperation({summary:'please try here https://documenter.getpostman.com/view/811020/UVC9hkcP'})
  @ApiConsumes('multipart/form-data')
  async updateCategories(@UploadedFile() file,@Param() params,@Request() request:any) {
    if(file)
    {
      if(file.length>0)
    
      request.body.image= file[0]
      else
      request.body.image= file
       
    }
    return await this.securityService.updateCategory(params.id,request.body,request.user);
  }
  @ApiParam({name: 'id', required: true})
  @Get('/delete-categories/:id')
  async deleteCategories(@Param() params,@Body()  editSecurityDto: EditCategoryDto,@Request() request:any) {
   
    return await this.securityService.updateCategory(params.id,editSecurityDto,request.user);
  }
}
