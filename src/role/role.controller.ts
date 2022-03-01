import {
  Controller,
  SetMetadata,
  Request,
  Get,
  Post,
  Delete,
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
} from '@nestjs/common';
import { RoleService } from './role.service';
import {
  ApiTags,
  ApiProperty,
  ApiSecurity,
  ApiBearerAuth,
  ApiParam,
  ApiConsumes,
  ApiOperation,
  ApiQuery,
} from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { User } from '../auth/user.model';
import { userInfo } from 'os';
import { Roles } from '../auth/roles.decorator';
import { Role } from '../auth/role.enum';
import { CreateRoleDto } from './dto/create-role';
import { EditRoleDto } from './dto/edit-role';
import {
  FileInterceptor,
  FilesInterceptor,
  FileFieldsInterceptor,
} from '@nestjs/platform-express';
import { ApiBody } from '@nestjs/swagger';
import { diskStorage } from 'multer';
import { extname } from 'path';

@Controller('role')
@ApiTags('Role')
@ApiBearerAuth()
@ApiSecurity('api_key')
export class RoleController {
  constructor(private RoleService: RoleService) {}

  @Get('/getRoles')
  async getRole(@Request() request) {
    return await this.RoleService.getAllRole(request.user);
  }

  @ApiParam({ name: 'id', required: true })
  @Get('/roles/:id')
  async getRoleDetail(@Param() params, @Request() request: any) {
    return await this.RoleService.getRoleDetail(params.id);
  }

  @UseGuards(AuthGuard('jwt'))
  @Roles(Role.ADMIN)
  @ApiConsumes('multipart/form-data', 'application/json')
  @ApiOperation({ summary: 'permissions:[{"operations":"goods","operationAccess":[{"IsEdit":true/false,"IsView":true/false,"IsDelete":true/false}]}]'})
  @Post('/add')
  async addRole(@Body() createRoleDto: CreateRoleDto, @Request() request) {
    console.log(request.user, 'request');
    return await this.RoleService.createRole(createRoleDto, request.user);
  }
  @UseGuards(AuthGuard('jwt'))
  @Roles(Role.ADMIN)
  @ApiConsumes('multipart/form-data', 'application/json')
  @ApiParam({ name: 'id', required: true })
  @ApiOperation({
    summary:
      '"operations":"goods","operationAccess":[{"IsEdit":true/false,"IsView":true/false,"IsDelete":true/false}]}],while updating changes will perform on query if there is no operation-name in query then it will add a new object in permissisonSection'
  })
  @ApiQuery({name:"operationName"})
  @ApiBody({ schema: {
    type: 'object',
    properties: {
      operations: {type: 'string'},
      isEdit: { type: 'boolean' },
      isView: { type: 'boolean' },
      isDelete: { type: 'boolean' },
    },
  }})
  @Put('/update/:id')

  async updateRole(
    @Param() params,
    @Body() editRoleDto: EditRoleDto,
    @Request() request: any,
    @Query() query
  ) {
    return await this.RoleService.updateRole(
      params.id,
      query.operationName,
      editRoleDto,
      request.user,
    );
  }

  @UseGuards(AuthGuard('jwt'))
  @Roles(Role.ADMIN)
  @ApiParam({ name: 'id', required: true })
  @ApiConsumes('multipart/form-data', 'application/json')
  @Delete('/delete/:id')
  async deleteRole(@Param('id') id: string) {
    return await this.RoleService.deleteRole(id);
  }
}
