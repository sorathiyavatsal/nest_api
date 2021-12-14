import { Controller, SetMetadata, Request,Get, Post, Delete, Body, Put, ValidationPipe, Query, Req, Res, Param, UseGuards, UseInterceptors, UploadedFile } from '@nestjs/common';
import { RoleService} from "./role.service"
import { ApiTags, ApiProperty, ApiSecurity, ApiBearerAuth,ApiParam,ApiConsumes,  ApiOperation } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { User } from "../auth/user.model";
import { userInfo } from 'os';
import { Roles } from '../auth/roles.decorator';
import { Role } from '../auth/role.enum';
import { CreateRoleDto } from './dto/create-role';
import { EditRoleDto } from './dto/edit-role';
import {FileInterceptor,FilesInterceptor,FileFieldsInterceptor} from '@nestjs/platform-express'
import { ApiBody } from '@nestjs/swagger';
import { diskStorage } from 'multer';
import { extname } from 'path';

@Controller('Role')
@ApiTags('Role')
@ApiBearerAuth()
@ApiSecurity('api_key')


export class RoleController {
    constructor(private RoleService: RoleService) { }
  
  @Get('/get-all-roles')
  async getRole(@Request() request) {
    
    return await this.RoleService.getAllRole(request.user);
  }

  @ApiParam({name: 'id', required: true})
  @Get('/roles/:id')
  async getRoleDetail(@Param() params,@Request() request:any) {
   
    return await this.RoleService.getRoleDetail(params.id);
  }

  @UseGuards(AuthGuard('jwt'))
 @Roles(Role.ADMIN)
  @Post('/add-roles')
  async addRole(@Body()  createRoleDto: CreateRoleDto,@Request() request) {
   
    return await this.RoleService.createRole(createRoleDto,request.user);
  }
  @UseGuards(AuthGuard('jwt'))
@Roles(Role.ADMIN)
  @ApiParam({name: 'id', required: true})
  @Put('/update-Role/:id')
  async updateRole(@Param() params,@Body()  editRoleDto: EditRoleDto,@Request() request:any) {
   
    return await this.RoleService.updateRole(params.id,editRoleDto,request.user);
  }
  
  @UseGuards(AuthGuard('jwt'))
  @Roles(Role.ADMIN)
  @ApiParam({name: 'id', required: true})
  @Delete('/delete-Role/:id')
  async deleteRole(@Param('id') id: string) {
    return await this.RoleService.deleteRole(id);
  }
}
