import { Controller, Post, UseGuards, Request, Get } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import {
  ApiBearerAuth,
  ApiBody,
  ApiConsumes,
  ApiSecurity,
  ApiTags,
} from '@nestjs/swagger';
import { Roles } from 'src/auth/roles.decorator';
import { OrderService } from './order.service';

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

  @Post('/add')
  @UseGuards(AuthGuard('jwt'))
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        orderID: {
          type: 'string',
        },
        orderDate: {
          type: 'string',
        },
        orderStatus: {
          type: 'string',
        },
        customerName: {
          type: 'string',
        },
        TotalBill: {
          type: 'string',
        },
        bill_streetAddress: {
          type: 'string',
        },
        bill_landmark: {
          type: 'string',
        },
        bill_city: {
          type: 'string',
        },
        bill_state: {
          type: 'string',
        },
        bill_zipcode: {
          type: 'number',
        },
        bill_email: {
          type: 'string',
        },
        bill_mobile_no: {
          type: 'string',
        },
        ship_streetAddress: {
          type: 'string',
        },
        ship_landmark: {
          type: 'string',
        },
        ship_city: {
          type: 'string',
        },
        ship_state: {
          type: 'string',
        },
        ship_zipcode: {
          type: 'number',
        },
      },
    },
  })
  @ApiConsumes('multipart/form-data', 'application/json')
  async postOrder(@Request() request) {
    return await this.OrderService.postOrder();
  }
}
