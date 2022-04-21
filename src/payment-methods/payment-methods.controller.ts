import {
  Controller,
  Post,
  UseGuards,
  Request,
  Body,
  Get,
  Query,
  Patch,
  Delete,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import {
  ApiBearerAuth,
  ApiConsumes,
  ApiSecurity,
  ApiTags,
  ApiBody,
  ApiQuery,
} from '@nestjs/swagger';
import { PaymentMethodsService } from './payment-methods.service';

@Controller('payment-methods')
@ApiTags('Payment')
@ApiBearerAuth()
@ApiSecurity('api_key')
export class PaymentMethodsController {
  constructor(private paymentMethodsService: PaymentMethodsService) {}

  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        razorpay_id: {
          type: 'string',
        },
        razorpay_secret_id: {
          type: 'string',
        },
        orderId: {
          type: 'string',
        },
        amount: {
          type: 'number',
        },
      },
    },
  })
  @Post('create-razorpay-order')
  @UseGuards(AuthGuard('jwt'))
  @ApiConsumes('multipart/form-data', 'application/json')
  async createRazorPayOrder(@Body() orderData: any, @Request() request: any) {
    return await this.paymentMethodsService.createRazorPayOrder(orderData);
  }

  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        userId: {
          type: 'string',
        },
        type: {
          type: 'string',
          enum: ['CARD', 'NETBANKING', 'UPI'],
        },
        card: {
          type: 'object',
          properties: {
            cardNumber: {
              type: 'string',
            },
            cardName: {
              type: 'string',
            },
            expiryDate: {
              type: 'string',
            },
          },
          example: {
            cardNumber: '411111111111111',
            cardName: 'Jhon',
            expiryDate: '12/33',
          },
        },
        netBankingName: {
          type: 'string',
        },
        upi: {
          type: 'string',
        },
      },
    },
  })
  @Post('details')
  @UseGuards(AuthGuard('jwt'))
  @ApiConsumes('multipart/form-data', 'application/json')
  async createPaymentMethods(@Body() orderData: any, @Request() request: any) {
    return await this.paymentMethodsService.createPaymentMethods(orderData);
  }

  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        card: {
          type: 'object',
          properties: {
            cardNumber: {
              type: 'string',
            },
            cardName: {
              type: 'string',
            },
            expiryDate: {
              type: 'string',
            },
          },
          example: {
            cardNumber: '411111111111111',
            cardName: 'Jhon',
            expiryDate: '12/33',
          },
        },
        netBankingName: {
          type: 'string',
        },
        upi: {
          type: 'string',
        },
      },
    },
  })
  @Patch('details')
  @UseGuards(AuthGuard('jwt'))
  @ApiConsumes('multipart/form-data', 'application/json')
  @ApiQuery({ name: 'userId', required: true, type: 'string' })
  @ApiQuery({ name: 'paymentDetailsId', required: true, type: 'string' })
  async patchPaymentMethods(@Body() orderData: any, @Query() query) {
    return await this.paymentMethodsService.patchPaymentMethods(query.userId, query.paymentDetailsId, orderData);
  }

  @Get('details')
  @UseGuards(AuthGuard('jwt'))
  @ApiConsumes('multipart/form-data', 'application/json')
  @ApiQuery({ name: 'userId', required: false, type: 'string' })
  async fetchPaymentMethods(@Query() query: any) {
    return await this.paymentMethodsService.fetchPaymentMethods(query);
  }

  @Delete('details')
  @UseGuards(AuthGuard('jwt'))
  @ApiConsumes('multipart/form-data', 'application/json')
  @ApiQuery({ name: 'paymentDetailsId', required: true, type: 'string' })
  async deletePaymentMethods(@Query() query: any) {
    return await this.paymentMethodsService.deletePaymentMethods(query.paymentDetailsId);
  }

  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        razorpay_order_id: {
          type: 'string',
        },
        razorpay_payment_id: {
          type: 'string',
        },
        razorpay_signature: {
          type: 'string',
        },
      },
    },
  })
  @Post('/verify')
  @UseGuards(AuthGuard('jwt'))
  async verifyPaymentAndSave(@Body() orderData: any, @Request() request: any) {
    console.log(orderData);
    return this.paymentMethodsService.verifyPaymentAndSave(orderData);
  }
}
