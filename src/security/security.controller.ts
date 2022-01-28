import { Controller, SetMetadata, Request,Get, Post, Body, Put, ValidationPipe, Query, Req, Res, Param, UseGuards, UseInterceptors, UploadedFile } from '@nestjs/common';
import { SecurityService} from "./security.service"
import { ApiTags, ApiSecurity, ApiBearerAuth, ApiOperation, ApiConsumes } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { User } from "../auth/user.model";
import { userInfo } from 'os';
import { ApiProperty,ApiParam } from '@nestjs/swagger';
import { Roles } from '../auth/roles.decorator';
import { Role } from '../auth/role.enum';
import { CreateSecurityDto } from './dto/create-security';
import { EditSecurityDto } from './dto/edit-security';
@Controller('security')
@ApiTags('REST API KEYS')
@ApiBearerAuth()
@UseGuards(AuthGuard('jwt'))
@Roles(Role.ADMIN)

export class SecurityController {
    constructor(private securityService: SecurityService) { }
  
  @Get('/all-rest-api-keys')
  async getAllUsers(@Request() request) {
    
    return await this.securityService.getAllCustomers(request.user);
  }
  @Post('/add/rest-api-key')
  @ApiConsumes('multipart/form-data','application/json')
  async addCustomer(@Body()  createSecurityDto: CreateSecurityDto,@Request() request) {
   
    return await this.securityService.createAPIUser(createSecurityDto,request.user);
  }
  @ApiParam({name: 'id', required: true})
  @Put('/update/rest-api-key/:id')
  @ApiConsumes('multipart/form-data','application/json')
  async updateCustomer(@Param() params,@Body()  editSecurityDto: EditSecurityDto,@Request() request:any) {
   
    return await this.securityService.updateAPIUser(params.id,editSecurityDto,request.user);
  }
}
