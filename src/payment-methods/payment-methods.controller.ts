import {
    Controller,
    Post,
    UseGuards,
    Request,
    Get,
    Body,
    Param,
    Query,
    Render
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import {
    ApiBearerAuth,
    ApiConsumes,
    ApiParam,
    ApiQuery,
    ApiSecurity,
    ApiTags,
    ApiBody
} from '@nestjs/swagger';
import { PaymentMethodsService } from './payment-methods.service';

@Controller('payment-methods')
@ApiTags('Payment')
@ApiBearerAuth()
@ApiSecurity('api_key')
export class PaymentMethodsController {
    constructor(private paymentMethodsService: PaymentMethodsService) { }

    @ApiBody(
        {
            schema: {
                type: 'object',
                properties: {
                    amount: {
                        type: 'number'
                    }
                }
            },
        })
    @Post('create-razorpay-order')
    @UseGuards(AuthGuard('jwt'))
    @ApiConsumes('multipart/form-data', 'application/json')
    async createRazorPayOrder(@Body() orderData: any, @Request() request: any) {
        console.log(orderData)
        return await this.paymentMethodsService.createRazorPayOrder(orderData);
    }


    @ApiBody(
        {
            schema: {
                type: 'object',
                properties: {
                    razorpay_order_id: {
                        type: 'string'
                    },
                    razorpay_payment_id: {
                        type: 'string'
                    },
                    razorpay_signature: {
                        type: 'string'
                    },
                }
            },
        })
    @Post('/verify')
    @UseGuards(AuthGuard('jwt'))
    async verifyPaymentAndSave(@Body() orderData: any, @Request() request: any) {
        console.log(orderData);
        return this.paymentMethodsService.verifyPaymentAndSave(orderData);
    }

}