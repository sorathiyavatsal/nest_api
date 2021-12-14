import { Controller, SetMetadata, Request,Get, Post, Delete, Body, Put, ValidationPipe, Query, Req, Res, Param, UseGuards, UseInterceptors, UploadedFile } from '@nestjs/common';
import { ProfileService} from "./profile.service"
import { ApiTags, ApiProperty, ApiSecurity, ApiBearerAuth,ApiParam,ApiConsumes,  ApiOperation } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { User } from "../auth/user.model";
import { userInfo } from 'os';
import { Roles } from '../auth/roles.decorator';
import { Role } from '../auth/role.enum';
import { CreateProfileDto } from './dto/create-profile';
import { EditProfileDto } from './dto/edit-profile';
import {FileInterceptor,FilesInterceptor,FileFieldsInterceptor} from '@nestjs/platform-express'
import { ApiBody } from '@nestjs/swagger';
import { diskStorage } from 'multer';
import { extname } from 'path';

@Controller('profile')
@ApiTags('Profile')
@ApiBearerAuth()
@ApiSecurity('api_key')


export class ProfileController {
    constructor(private ProfileService: ProfileService) { }
  
  @Get('/get-all-profile')
  async getProfile(@Request() request) {
    
    return await this.ProfileService.getAllProfile(request.user);
  }

  @ApiParam({name: 'id', required: true})
  @Get('/profile/:id')
  async getProfileDetail(@Param() params,@Request() request:any) {
   
    return await this.ProfileService.getProfileDetail(params.id);
  }

  @UseGuards(AuthGuard('jwt'))
 @Roles(Role.ADMIN)
  @Post('/add-profile')
  async addProfile(@Body()  createProfileDto: CreateProfileDto,@Request() request) {
   
    return await this.ProfileService.createProfile(createProfileDto,request.user);
  }
  @UseGuards(AuthGuard('jwt'))
@Roles(Role.ADMIN)
  @ApiParam({name: 'id', required: true})
  @Put('/update-profile/:id')
  async updateProfile(@Param() params,@Body()  editprofileDto: EditProfileDto,@Request() request:any) {
   
    return await this.ProfileService.updateProfile(params.id,editprofileDto,request.user);
  }
  
  @UseGuards(AuthGuard('jwt'))
  @Roles(Role.ADMIN)
  @ApiParam({name: 'id', required: true})
  @Delete('/delete-profile/:id')
  async deleteProfile(@Param('id') id: string) {
    return await this.ProfileService.deleteProfile(id);
  }
}
