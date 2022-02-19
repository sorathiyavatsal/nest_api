import {
  Controller,
  SetMetadata,
  UploadedFiles,
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
  Response,
  HttpCode,
} from '@nestjs/common';
import {
  ApiTags,
  ApiProperty,
  ApiSecurity,
  ApiBearerAuth,
  ApiParam,
  ApiConsumes,
  ApiOperation,
} from '@nestjs/swagger';
import { PartnersService } from './partners.service';
import { AuthGuard } from '@nestjs/passport';
import { Roles } from '../auth/roles.decorator';
import { ApiBody } from '@nestjs/swagger';
import {
  FileInterceptor,
  FilesInterceptor,
  FileFieldsInterceptor,
} from '@nestjs/platform-express';
import { CreatePartnerDto } from './dto/create-partners'
import { GetPartnerDto } from './dto/get-partners'
import { EditPartnerDto } from './dto/edit-partners'

@Controller('partners')
@ApiTags('Partners')
@ApiBearerAuth()
@ApiSecurity('api_key')
export class PartnersController {
  constructor(private PartnersService: PartnersService) { }

  @Get('/')
  @UseGuards(AuthGuard('jwt'))
  @Roles('ADMIN')
  async getAllPartners(
    @Param() getPartnerDto: GetPartnerDto,
    @Response() response) {
    const data = await this.PartnersService.getAllPartners(getPartnerDto);
    response.json(data)
  }

  @Post('/add')
  @UseGuards(AuthGuard('jwt'))
  @ApiConsumes('multipart/form-data', 'application/json')
  async postPartners(
    @Body() createPartnerDto: CreatePartnerDto,
    @Response() response,
  ) {
    const data = await this.PartnersService.postPartners(createPartnerDto);
    response.json(data)
  }

  @Put('/update')
  @UseGuards(AuthGuard('jwt'))
  @ApiConsumes('multipart/form-data', 'application/json')
  @ApiParam({ name: 'id', required: true })
  async putPartners(
    @Body() editPartnerDto: EditPartnerDto,
    @Param() params,
    @Response() response,
  ) {
    const data = await this.PartnersService.putPartners(editPartnerDto, params.id);
    response.json(data)
  }

  @Delete('/delete')
  @UseGuards(AuthGuard('jwt'))
  @ApiConsumes('multipart/form-data', 'application/json')
  @ApiParam({ name: 'id', required: true })
  async deletePartners(
    @Param() params,
    @Response() response,
  ) {
    const data = await this.PartnersService.deletePartners(params.id);
    response.json("partner delete successfully")
  }
}
