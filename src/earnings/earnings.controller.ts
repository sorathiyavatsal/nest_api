import { Body, Controller, Post, UseGuards,Request, Get, Param  } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiBearerAuth, ApiConsumes, ApiParam, ApiSecurity, ApiTags } from '@nestjs/swagger';
import { EarningsService } from './earnings.service';
import { EarningDto } from './dto/earnings';
import { Roles } from 'src/auth/roles.decorator';

@Controller('earnings')
@ApiTags('earnings')
@ApiBearerAuth()
@ApiSecurity('api_key')
export class EarningsController {
  constructor(private EarningsService: EarningsService) {}

  @Get('/all')
  @UseGuards(AuthGuard('jwt'))
  @Roles('ADMIN')
  async getAllOrders(@Request() request) {
    return await this.EarningsService.getAllEarning();
  }

  @ApiParam({ name: 'id', required: true })
  @Get('/:id')
  @UseGuards(AuthGuard('jwt'))
  async getOrder(@Param() params, @Request() request: any) {
    return await this.EarningsService.getEarning(params.id);
  }

  @Post('/add')
  @UseGuards(AuthGuard('jwt'))
  @ApiConsumes('multipart/form-data', 'application/json')
  async postOrder(@Body() earningDto: EarningDto, @Request() request) {
    return await this.EarningsService.postEarning(earningDto);
  }
}
