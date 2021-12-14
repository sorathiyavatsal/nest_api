import { Controller, SetMetadata, Request,Get, Post, Delete, Body, Put, ValidationPipe, Query, Req, Res, Param, UseGuards, UseInterceptors, UploadedFile } from '@nestjs/common';
import { PackagingsService} from "./packaging.service"
import { ApiTags, ApiProperty,ApiSecurity, ApiBearerAuth,ApiParam,ApiConsumes,  ApiOperation } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { User } from "../auth/user.model";
import { userInfo } from 'os';
import { Roles } from '../auth/roles.decorator';
import { Role } from '../auth/role.enum';
import { CreatePackagingsDto } from './dto/create-packaging';
import { EditPackagingsDto } from './dto/edit-packaging';
import {FileInterceptor,FilesInterceptor,FileFieldsInterceptor} from '@nestjs/platform-express'
import { ApiBody } from '@nestjs/swagger';
import { diskStorage } from 'multer';
import { extname } from 'path';

@Controller('packaging')
@ApiTags('Packagings')
@ApiBearerAuth()
@ApiSecurity('api_key')


export class PackagingsController {
    constructor(private Packagingservice: PackagingsService) { }
  
    
  @Get('/get-all-Packagings')
  async getPackagings(@Request() request) {
    
    return await this.Packagingservice.getAllPackagings(request.user);
  }

  @ApiParam({name: 'id', required: true})
  @Get('/packagings/:id')
  async getPackagingsDetail(@Param() params,@Request() request:any) {
   
    return await this.Packagingservice.getPackagingsDetail(params.id);
  }
  @UseGuards(AuthGuard('jwt'))
@Roles(Role.ADMIN)
  @Post('/add-Packagings')
  async addPackagings(@Body()  createPackagingsDto: CreatePackagingsDto,@Request() request) {
   
    return await this.Packagingservice.createPackagings(createPackagingsDto,request.user);
  }
  @UseGuards(AuthGuard('jwt'))
@Roles(Role.ADMIN)
  @ApiParam({name: 'id', required: true})
  @Put('/update-Packagings/:id')
  async updatePackagings(@Param() params,@Body()  editPackagingsDto: EditPackagingsDto,@Request() request:any) {
   
    return await this.Packagingservice.updatePackagings(params.id,editPackagingsDto,request.user);
  }
  
  @UseGuards(AuthGuard('jwt'))
  @Roles(Role.ADMIN)
  @ApiParam({name: 'id', required: true})
  @Delete('/delete-Packagings/:id')
  async deletePackagings(@Param('id') id: string) {
    return await this.Packagingservice.deletePackagings(id);
  }
}
