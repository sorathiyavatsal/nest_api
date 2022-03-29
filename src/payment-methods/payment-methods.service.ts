import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { InjectRazorpay } from 'nestjs-razorpay';
import { PaymentMethods } from './payment-methods.model';
// import * as Razorpay from 'razorpay';

declare type Razorpay = typeof import("razorpay");

@Injectable()
export class PaymentMethodsService {

    orderResponse: any;

    constructor(
        @InjectRazorpay() private readonly razorpayClient: Razorpay,
        @InjectModel('PaymentMethods') private PaymentModel: Model<PaymentMethods>
    ) { }


    async createRazorPayOrder(orderData: any) {
        console.log(orderData.amount);
        var options = {
            amount: orderData.amount * 100,  // amount in the smallest currency unit
            currency: "INR"
        };
        var orderRes = {};
        await this.razorpayClient.orders.create(options, async (err, order) => {
            if (err) {
                console.log(err);
            } else {
                orderRes = {
                    amount: order.amount, order_id: order.id, method: orderData.paymentMethod
                }
                this.orderResponse = orderRes;
            }
        });
        return orderRes;
    }

    async verifyPaymentAndSave(req) {
        console.log(req);
        let body = req.razorpay_order_id + "|" + req.razorpay_payment_id;
        var crypto = require("crypto");
        var expectedSignature = crypto.createHmac('sha256', 'AFpsju7mn5moZPQKljRqVDAp')
            .update(body.toString())
            .digest('hex');
        console.log("sig" + req.razorpay_signature);
        console.log("sig" + expectedSignature);

        if (expectedSignature === req.razorpay_signature) {
            console.log("Payment Success");
            await new this.PaymentModel(req).save();
            return { meta: { status: true, msg: 'Your payment successful!' } };
        } else {
            console.log("Payment Fail");
        }
    }

}