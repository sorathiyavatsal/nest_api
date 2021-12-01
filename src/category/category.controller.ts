import { Controller, SetMetadata, Request,Get, Post, Body, Put, ValidationPipe, Query, Req, Res, Param, UseGuards, UseInterceptors, UploadedFile } from '@nestjs/common';
import { CustomerService} from "./customer.service"
import { ApiTags, ApiSecurity, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { User } from "../auth/user.model";
import { userInfo } from 'os';
import { ApiProperty,ApiParam } from '@nestjs/swagger';
import { Roles } from '../auth/roles.decorator';
import { Role } from '../auth/role.enum';
import { CreateCustomerDto } from './dto/create-customer';
import { EditCustomerDto } from './dto/edit-customer';
@Controller('customer')
@ApiTags('Customers')
@ApiBearerAuth()
@UseGuards(AuthGuard('jwt'))
@Roles(Role.ADMIN)

export class CategoryController {
    constructor(private securityService: SecurityService) { }
  
  @Get('/get-all-customers')
  async getAllUsers(@Request() request) {
    
    return await this.securityService.getAllCustomers(request.user);
  }
  @Post('/add-customer')
  async addCustomer(@Body()  createSecurityDto: CreateSecurityDto,@Request() request) {
   
    return await this.securityService.createAPIUser(createSecurityDto,request.user);
  }
  @ApiParam({name: 'id', required: true})
  @Put('/update-customer/:id')
  async updateCustomer(@Param() params,@Body()  editSecurityDto: EditSecurityDto,@Request() request:any) {
   
    return await this.securityService.updateAPIUser(params.id,editSecurityDto,request.user);
  }
}
