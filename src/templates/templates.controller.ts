import {
  Controller,
  SetMetadata,
  UploadedFiles,
  Request,
  Get,
  Post,
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
  Delete,
} from '@nestjs/common';
import { TemplatesService } from './templates.service';
import {
  ApiTags,
  ApiBearerAuth,
  ApiParam,
  ApiConsumes,
  ApiOperation,
  ApiSecurity,
} from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { User } from '../auth/user.model';
import { userInfo } from 'os';
import { Roles } from '../auth/roles.decorator';
import { Role } from '../auth/role.enum';
import { CreateTemplateDto, filterDto } from './dto/create-template';
import * as rawbody from 'raw-body';
import { FileInterceptor } from '@nestjs/platform-express';
import { Express } from 'express';

@Controller('template')
@ApiTags('Message Templates')
@ApiSecurity('api_key')
export class TemplatesController {
  constructor(private templatesService: TemplatesService) {}
  @ApiOperation({ summary: 'Add New Templates' })
  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'))
  @Roles(Role.ADMIN)
  @Post('/')
  @UseInterceptors(FileInterceptor('file'))
  @ApiConsumes('multipart/form-data', 'application/json')
  async addTemplates(
    @UploadedFile() file,
    @Body() createTemplateDto: CreateTemplateDto,
    @Req() req,
  ) {
    return await this.templatesService.createnewTemplate(
      createTemplateDto,
      req,
    );
  }
  @ApiOperation({ summary: 'Update existing Templates' })
  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'))
  @Roles(Role.ADMIN)
  @Put('/:id')
  @ApiConsumes('multipart/form-data', 'application/json')
  @UseInterceptors(FileInterceptor('file'))
  @ApiParam({ name: 'id', required: true })
  async updateTemplates(
    @Param() params,
    @UploadedFile() file,
    @Body() createTemplateDto: CreateTemplateDto,
    @Req() req,
  ) {
    return await this.templatesService.updateTemplate(
      params.id,
      createTemplateDto,
      req,
    );
  }
  @ApiOperation({ summary: 'Get All Templates' })
  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'))
  @Roles(Role.ADMIN)
  @Get('/')
  async getTemplates(@Req() req, @Query() filter: filterDto) {
    return await this.templatesService.getTemplates(filter);
  }
  @ApiOperation({ summary: 'Get Template By Id' })
  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'))
  @Roles(Role.ADMIN)
  @Get('/:id')
  @ApiParam({ name: 'id', required: true })
  async getTemplateDate(@Param() params, @Req() req) {
    return await this.templatesService.getTemplateData(params.id);
  }
  @ApiOperation({ summary: 'Delete Template By Id' })
  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'))
  @Roles(Role.ADMIN)
  @Delete('/:id')
  @ApiParam({ name: 'id', required: true })
  async deleteTemplateDate(@Param() params, @Req() req) {
    return await this.templatesService.deleteTemplateData(params.id);
  }
}
