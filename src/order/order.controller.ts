import { Controller, Post, UseGuards, Request, Get, Body, Param } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import {
  ApiBearerAuth,
  ApiBody,
  ApiConsumes,
  ApiParam,
  ApiSecurity,
  ApiTags,
} from '@nestjs/swagger';
import { Roles } from 'src/auth/roles.decorator';
import { OrderService } from './order.service';
import { OrderDto } from './dto/create-order';
@Controller('order')
@ApiTags('Order')
@ApiBearerAuth()
@ApiSecurity('api_key')
export class OrderController {
    constructor(private OrderService: OrderService) {}

  @Get('/all')
  @UseGuards(AuthGuard('jwt'))
  @Roles('ADMIN')
  async getAllOrders(@Request() request) {
    return await this.OrderService.getAllOrder();
  }

  @ApiParam({ name: 'id', required: true })
  @Get('/:id')
  @UseGuards(AuthGuard('jwt'))
  async getOrder(@Param() params, @Request() request: any) {
    return await this.OrderService.getOrder(params.id);
  }

  @Post('/add')
  @UseGuards(AuthGuard('jwt'))
  @ApiConsumes('multipart/form-data', 'application/json')
  async postOrder(@Body() orderDto: OrderDto, @Request() request) {
    return await this.OrderService.postOrder(orderDto);
  }
}
