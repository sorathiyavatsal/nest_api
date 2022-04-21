import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { InjectRazorpay } from 'nestjs-razorpay';
import { PaymentMethods } from './payment-methods.model';
import { PaymentDetails } from './paymentDetails.model';
let ObjectId = require('mongodb').ObjectId;
declare type Razorpay = typeof import('razorpay');

@Injectable()
export class PaymentMethodsService {
  orderResponse: any;

  constructor(
    @InjectRazorpay() private readonly razorpayClient: Razorpay,
    @InjectModel('PaymentMethods') private PaymentModel: Model<PaymentMethods>,
    @InjectModel('PaymentDetails')
    private PaymentDetails: Model<PaymentDetails>,
  ) {}

  async fetchPaymentMethods(filter: any) {
    let condition = {};

    if (filter.userId) {
      condition['userId'] = ObjectId(filter.userId);
    }

    return await this.PaymentDetails.find(condition);
  }

  async deletePaymentMethods(paymentDetailsId: String) {
    return await this.PaymentDetails.deleteOne({
      _id: ObjectId(paymentDetailsId),
    });
  }

  async patchPaymentMethods(
    userId: String,
    paymentDetailsId: String,
    updateDto: any,
  ) {
    var paymentDetails = await this.PaymentDetails.findOne({
      _id: ObjectId(paymentDetailsId),
    });

    let updateData = {};

    if (paymentDetails.type == 'CARD') {
      if (updateDto.card) {
        updateData['card'] = updateDto.card;
      }
    }

    if (paymentDetails.type == 'NETBANKING') {
      if (updateDto.netBankingName) {
        updateData['netBankingName'] = updateDto.netBankingName;
      }
    }

    if (paymentDetails.type == 'UPI') {
      if (updateDto.upi) {
        updateData['upi'] = updateDto.upi;
      }
    }

    return await this.PaymentDetails.updateOne(
      {
        _id: ObjectId(paymentDetailsId),
        userId: ObjectId(userId),
      },
      {
        $set: updateData,
      },
      {
        $upset: true,
      },
    );
  }

  async createPaymentMethods(orderData: any) {
    let flag = false;
    if (orderData.type == 'CARD') {
      if (orderData.card) {
        flag = true;
      }
    }

    if (orderData.type == 'NETBANKING') {
      if (orderData.netBankingName) {
        flag = true;
      }
    }

    if (orderData.type == 'UPI') {
      if (orderData.upi) {
        flag = true;
      }
    }

    if (flag) {
      return await new this.PaymentDetails(orderData).save();
    } else {
      return `${orderData.type} details not found`;
    }
  }

  async createRazorPayOrder(orderData: any) {
    var options = {
      amount: orderData.amount * 100,
      currency: 'INR',
    };
    const order = await this.razorpayClient.orders.create(options);
    return order;
  }

  async verifyPaymentAndSave(req) {
    let body = req.razorpay_order_id + '|' + req.razorpay_payment_id;
    var crypto = require('crypto');
    var expectedSignature = crypto
      .createHmac('sha256', 'AFpsju7mn5moZPQKljRqVDAp')
      .update(body.toString())
      .digest('hex');

    if (expectedSignature === req.razorpay_signature) {
      await new this.PaymentModel(req).save();
      return { meta: { status: true, msg: 'Your payment successful!' } };
    } else {
      console.log('Payment Fail');
    }
  }
}
