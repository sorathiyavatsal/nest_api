import { Controller, SetMetadata,UploadedFiles, Request,Get, Post, Body, Put, ValidationPipe, Query, Req, Res, Param, UseGuards, UseInterceptors, UploadedFile } from '@nestjs/common';
import { TemplatesService } from "./templates.service"
import { ApiTags, ApiBearerAuth,ApiParam,ApiConsumes, ApiOperation } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { User } from "../auth/user.model";
import { userInfo } from 'os';
import { Roles } from '../auth/roles.decorator';
import { Role } from '../auth/role.enum';
import { CreateTemplateDto } from './dto/create-template';
import * as rawbody from 'raw-body';
import {FileInterceptor} from '@nestjs/platform-express'
import { Express } from 'express';

@Controller('templates')
@ApiTags('Message Templates')
@UseGuards(AuthGuard('jwt'))
@Roles(Role.ADMIN)
@ApiBearerAuth()
export class TemplatesController {
    constructor(private templatesService: TemplatesService) {

     }
    @Post('/add-template')
    @UseInterceptors(FileInterceptor('file'))
    @ApiConsumes('multipart/form-data','application/json')
    async addTemplates(@UploadedFile() file,@Body()  createTemplateDto: CreateTemplateDto, @Req() req) {
     
      return await this.templatesService.createnewTemplate(createTemplateDto,req);
    }
    @Put('/update-template/:id')
    @ApiConsumes('multipart/form-data','application/json')
    @UseInterceptors(FileInterceptor('file'))
    @ApiParam({name: 'id', required: true})
    async updateTemplates(@Param() params,@UploadedFile() file,@Body()  createTemplateDto: CreateTemplateDto, @Req() req) {
     
      return await this.templatesService.updateTemplate(params.id,createTemplateDto,req);
    }
    @Get('/get-templates')
    async getTemplates(@Req() req) {
     
      return await this.templatesService.getTemplates();
    } 
    @Get('/get-template/:id')
    @ApiParam({name: 'id', required: true})
    async getTemplateDate(@Param() params,@Req() req) {
     
      return await this.templatesService.getTemplateData(params.id);
    }  
}
