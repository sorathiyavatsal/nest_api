import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiConsumes,
  ApiParam,
  ApiSecurity,
  ApiTags,
} from '@nestjs/swagger';
import { InvoiceService } from './invoice.service';
import { InvoiceDistanceDto } from './dto/create-invoice';
import { AuthGuard } from '@nestjs/passport';
@Controller('invoice')
@ApiTags('invoice')
@ApiBearerAuth()
@ApiSecurity('api_key')
export class InvoiceController {
  constructor(private invoiceService: InvoiceService) {}

  @Get('/all')
  @UseGuards(AuthGuard('jwt'))
  async getGoods(@Request() request) {
    return await this.invoiceService.getAllInvoices();
  }

  @ApiParam({ name: 'id', required: true })
  @Get('/:id')
  @UseGuards(AuthGuard('jwt'))
  async getGoodsDetail(@Param() params, @Request() request: any) {
    return await this.invoiceService.getInvoiceDetail(params.id);
  }

  @ApiConsumes('multipart/form-data', 'application/json')
  @Post('/')
  @UseGuards(AuthGuard('jwt'))
  async addInvoice(
    @Body() invoiceDistanceDto: InvoiceDistanceDto,
    @Request() req,
  ) {
    return await this.invoiceService.addInvoice(invoiceDistanceDto, req.user);
  }
}
