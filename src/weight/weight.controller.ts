import {
  Controller,
  SetMetadata,
  Request,
  Get,
  Post,
  Body,
  Delete,
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
import { WeightsService } from './weight.service';
import {
  ApiTags,
  ApiProperty,
  ApiSecurity,
  ApiBearerAuth,
  ApiParam,
  ApiConsumes,
  ApiOperation,
} from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { User } from '../auth/user.model';
import { userInfo } from 'os';
import { Roles } from '../auth/roles.decorator';
import { Role } from '../auth/role.enum';
import { CreateWeightsDto } from './dto/create-weight';
import { EditWeightsDto } from './dto/edit-weight';
import {
  FileInterceptor,
  FilesInterceptor,
  FileFieldsInterceptor,
} from '@nestjs/platform-express';
import { ApiBody } from '@nestjs/swagger';
import { diskStorage } from 'multer';
import { extname } from 'path';

@Controller('weight')
@ApiTags('Weights')
@ApiBearerAuth()
@ApiSecurity('api_key')
export class WeightsController {
  constructor(private WeightsService: WeightsService) {}

  @Get('/get-all-weights')
  async getWeights(@Request() request) {
    return await this.WeightsService.getAllWeights(request.user);
  }
  @ApiParam({ name: 'id', required: true })
  @Get('/weights/:id')
  async getWeightsDetail(@Param() params, @Request() request: any) {
    return await this.WeightsService.getWeightsDetail(params.id);
  }
  @UseGuards(AuthGuard('jwt'))
  @Roles(Role.ADMIN)
  @Post('/add-weights')
  @ApiConsumes('multipart/form-data', 'application/json')
  async addWeights(
    @Body() createWeightsDto: CreateWeightsDto,
    @Request() request,
  ) {
    return await this.WeightsService.createWeights(
      createWeightsDto,
      request.user.user,
    );
  }
  @UseGuards(AuthGuard('jwt'))
  @Roles(Role.ADMIN)
  @ApiConsumes('multipart/form-data', 'application/json')
  @ApiParam({ name: 'id', required: true })
  @Put('/update-weights/:id')
  async updateWeights(
    @Param() params,
    @Body() editWeightsDto: EditWeightsDto,
    @Request() request: any,
  ) {
    return await this.WeightsService.updateWeights(
      params.id,
      editWeightsDto,
      request.user,
    );
  }
  @UseGuards(AuthGuard('jwt'))
  @Roles(Role.ADMIN)
  @ApiConsumes('multipart/form-data', 'application/json')
  @ApiParam({ name: 'id', required: true })
  @Delete('/delete-weights/:id')
  async deleteCategory(@Param('id') id: string) {
    return await this.WeightsService.deleteWeights(id);
  }
}
