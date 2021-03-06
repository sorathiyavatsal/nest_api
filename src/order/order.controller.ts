import {
  Controller,
  Post,
  UseGuards,
  Request,
  Get,
  Body,
  Param,
  Query,
  Patch,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import {
  ApiBearerAuth,
  ApiBody,
  ApiConsumes,
  ApiParam,
  ApiQuery,
  ApiSecurity,
  ApiTags,
} from '@nestjs/swagger';
import { Roles } from 'src/auth/roles.decorator';
import { OrderService } from './order.service';
import { OrderDto } from './dto/create-order';
import { UpdateOrderDto } from './dto/update-order';
import { query } from 'express';
let ObjectId = require('mongodb').ObjectId;

@Controller('order')
@ApiTags('Order')
@ApiBearerAuth()
@ApiSecurity('api_key')
export class OrderController {
  constructor(private OrderService: OrderService) {}

  @Get('/all')
  @UseGuards(AuthGuard('jwt'))
  @ApiQuery({ name: 'id', required: false })
  @ApiQuery({ name: 'name', required: false })
  @ApiQuery({ name: 'to_date', required: false })
  @ApiQuery({ name: 'from_date', required: false })
  async getAllOrders(@Query() query) {
    return await this.OrderService.getAllOrder(query);
  }

  @ApiQuery({ name: 'id', required: true })
  @Get('/')
  @UseGuards(AuthGuard('jwt'))
  async getOrder(@Query() query, @Request() request: any) {
    return await this.OrderService.getOrder(query.id);
  }

  @Get('/orderId')
  async getOrderId(@Request() request: any) {
    console.log('test');
    return {
      orderId: ObjectId(),
    };
  }

  @Post('/add')
  @UseGuards(AuthGuard('jwt'))
  @ApiConsumes('multipart/form-data', 'application/json')
  async postOrder(@Body() orderDto: OrderDto, @Request() request) {
    return await this.OrderService.postOrder(orderDto);
  }

  @Patch('/')
  @UseGuards(AuthGuard('jwt'))
  @ApiQuery({ name: 'id', required: true })
  @ApiConsumes('multipart/form-data', 'application/json')
  async patchpostOrder(
    @Body() updateOrderDto: UpdateOrderDto,
    @Query() query,
    @Request() request,
  ) {
    return await this.OrderService.patchOrder(query.id, updateOrderDto);
  }
}
