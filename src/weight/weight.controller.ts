import { Controller, SetMetadata, Request,Get, Post, Body, Delete, Put, ValidationPipe, Query, Req, Res, Param, UseGuards, UseInterceptors, UploadedFile } from '@nestjs/common';
import { WeightsService} from "./weight.service"
import { ApiTags, ApiProperty, ApiBearerAuth,ApiParam,ApiConsumes,  ApiOperation } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { User } from "../auth/user.model";
import { userInfo } from 'os';
import { Roles } from '../auth/roles.decorator';
import { Role } from '../auth/role.enum';
import { CreateWeightsDto } from './dto/create-weight';
import { EditWeightsDto } from './dto/edit-weight';
import {FileInterceptor,FilesInterceptor,FileFieldsInterceptor} from '@nestjs/platform-express'
import { ApiBody } from '@nestjs/swagger';
import { diskStorage } from 'multer';
import { extname } from 'path';

@Controller('weight')
@ApiTags('Weights')
@ApiBearerAuth()
@UseGuards(AuthGuard('jwt'))
@Roles(Role.ADMIN)

export class WeightsController {
    constructor(private WeightsService: WeightsService) { }
  
  @Get('/get-all-weights')
  async getWeights(@Request() request) {
    
    return await this.WeightsService.getAllWeights(request.user);
  }
  @ApiParam({name: 'id', required: true})
  @Get('/weights/:id')
  async getWeightsDetail(@Param() params,@Request() request:any) {
   
    return await this.WeightsService.getWeightsDetail(params.id);
  }
  @Post('/add-weights')

  async addWeights(@Body()  createWeightsDto: CreateWeightsDto,@Request() request) {
   
    return await this.WeightsService.createWeights(createWeightsDto,request.user);
  }
  @ApiParam({name: 'id', required: true})
  @Put('/update-weights/:id')
  async updateWeights(@Param() params,@Body()  editWeightsDto: EditWeightsDto,@Request() request:any) {
   
    return await this.WeightsService.updateWeights(params.id,editWeightsDto,request.user);
  }

  @ApiParam({name: 'id', required: true})
  @Delete('/delete-weights/:id')
  async deleteCategory(@Param('id') id: string) {
    return await this.WeightsService.deleteWeights(id);
  }
}
