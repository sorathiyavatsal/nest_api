import { Controller, SetMetadata, Request,Get, Post, Body, Put, Delete, ValidationPipe, Query, Req, Res, Param, UseGuards, UseInterceptors, UploadedFile } from '@nestjs/common';
import { HolidaysService} from "./holiday.service"
import { ApiTags, ApiProperty, ApiBearerAuth,ApiParam,ApiConsumes,  ApiOperation } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { User } from "../auth/user.model";
import { userInfo } from 'os';
import { Roles } from '../auth/roles.decorator';
import { Role } from '../auth/role.enum';
import { CreateHolidaysDto } from './dto/create-holiday';
import { EditHolidaysDto } from './dto/edit-holiday';
import {FileInterceptor,FilesInterceptor,FileFieldsInterceptor} from '@nestjs/platform-express'
import { ApiBody } from '@nestjs/swagger';
import { diskStorage } from 'multer';
import { extname } from 'path';

@Controller('holidays')
@ApiTags('Holidays')
@ApiBearerAuth()
@UseGuards(AuthGuard('jwt'))
@Roles(Role.ADMIN)


export class HolidaysController {
    constructor(private HolidayService: HolidaysService) { }
  
    
  @Get('/get-all-holidays')
  async getHolidays(@Request() request) {
    
    return await this.HolidayService.getAllHolidays(request.user);
  }

  @ApiParam({name: 'id', required: true})
  @Get('/holidays/:id')
  async getHolidaysDetail(@Param() params,@Request() request:any) {
   
    return await this.HolidayService.getHolidaysDetail(params.id);
  }

  @Post('/add-holidays')
  @ApiConsumes('multipart/form-data','application/json')
  async addHolidays(@Body()  createHolidaysDto: CreateHolidaysDto,@Request() request) {
   
    return await this.HolidayService.createHolidays(createHolidaysDto,request.user);
  }

  @ApiParam({name: 'id', required: true})
  @Put('/update-holidays/:id')
  @ApiConsumes('multipart/form-data','application/json')
  async updateHolidays(@Param() params,@Body()  editHolidaysDto: EditHolidaysDto,@Request() request:any) {
   
    return await this.HolidayService.updateHolidays(params.id,editHolidaysDto,request.user);
  }
  
 
  @ApiParam({name: 'id', required: true})
  @Delete('/delete-holidays/:id')
  async deleteCategory(@Param('id') id: string) {
    return await this.HolidayService.deleteHolidays(id);
  }
}
