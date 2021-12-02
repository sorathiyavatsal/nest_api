import { Controller, SetMetadata, Request,Get, Post, Delete, Body, Put, ValidationPipe, Query, Req, Res, Param, UseGuards, UseInterceptors, UploadedFile } from '@nestjs/common';
import { PackageService} from "./packages.service"
import { ApiTags, ApiProperty, ApiBearerAuth,ApiParam,ApiConsumes,  ApiOperation } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { User } from "../auth/user.model";
import { userInfo } from 'os';
import { Roles } from '../auth/roles.decorator';
import { Role } from '../auth/role.enum';
import { CreatePackagesDto } from './dto/create-packages';
import { EditPackagesDto } from './dto/edit-packages';
import {FileInterceptor,FilesInterceptor,FileFieldsInterceptor} from '@nestjs/platform-express'
import { ApiBody } from '@nestjs/swagger';
import { diskStorage } from 'multer';
import { extname } from 'path';

@Controller('packages')
@ApiTags('Packages')
@ApiBearerAuth()
@UseGuards(AuthGuard('jwt'))
@Roles(Role.ADMIN)

export class PackagesController {
    constructor(private PackagesService: PackageService) { }
  
  @Get('/get-all-packages')
  async getPackages(@Request() request) {
    
    return await this.PackagesService.getAllPackages(request.user);
  }

  @ApiParam({name: 'id', required: true})
  @Get('/packages/:id')
  async getPackagesDetail(@Param() params,@Request() request:any) {
   
    return await this.PackagesService.getPackgesDetail(params.id);
  }

  @Post('/add-packages')
  async addPackages(@Body()  createPackagesDto: CreatePackagesDto,@Request() request) {
   
    return await this.PackagesService.createPackages(createPackagesDto,request.user);
  }

  @ApiParam({name: 'id', required: true})
  @Put('/update-packages/:id')
  async updatePackages(@Param() params,@Body()  editPackagesDto: EditPackagesDto,@Request() request:any) {
   
    return await this.PackagesService.updatePackages(params.id,editPackagesDto,request.user);
  }
  
 
  @ApiParam({name: 'id', required: true})
  @Delete('/delete-packages/:id')
  async deleteCategory(@Param('id') id: string) {
    return await this.PackagesService.deletePackages(id);
  }
}
