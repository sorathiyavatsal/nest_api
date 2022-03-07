import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Order } from 'src/order/order.model';
let ObjectId = require('mongodb').ObjectId;

@Injectable()
export class EarningsService {
    constructor(@InjectModel('Order') private OrderModel: Model<Order>) {}

  async getAllOrder() {
    return await this.OrderModel.aggregate([
      {
        $lookup: {
          from: 'users',
          localField: 'shippingId',
          foreignField: '_id',
          as: 'shippingDetails',
        },
      },
      {
        $unwind: {
          path: '$shippingDetails',
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $lookup: {
          from: 'invoices',
          localField: 'paymentTransactionId',
          foreignField: '_id',
          as: 'paymentTransactionDetails',
        },
      },
      {
        $unwind: {
          path: '$paymentTransactionDetails',
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $lookup: {
          from: 'coupons',
          localField: 'copouns',
          foreignField: '_id',
          as: 'couponsDetails',
        },
      },
    ]);
  }

  async getOrder(orderId: String) {
    return await this.OrderModel.aggregate([
      {
        $lookup: {
          from: 'users',
          localField: 'shippingId',
          foreignField: '_id',
          as: 'shippingDetails',
        },
      },
      {
        $unwind: {
          path: '$shippingDetails',
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $lookup: {
          from: 'invoices',
          localField: 'paymentTransactionId',
          foreignField: '_id',
          as: 'paymentTransactionDetails',
        },
      },
      {
        $unwind: {
          path: '$paymentTransactionDetails',
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $lookup: {
          from: 'coupons',
          localField: 'copouns',
          foreignField: '_id',
          as: 'couponsDetails',
        },
      },
      { $match: { _id: ObjectId(orderId) } },
    ]);
  }

  async postOrder(orderDto: any) {
    let order = {
      orderType: orderDto.orderType,
      orderDate: orderDto.orderDate,
      subTotal: orderDto.subTotal,
      tax: orderDto.tax,
      shipingAddress: orderDto.shipingAddress,
      billingAddress: orderDto.billingAddress,
      shippingId: ObjectId(orderDto.shippingId),
      paymentTransactionId: ObjectId(orderDto.paymentTransactionId),
    };

    return await new this.OrderModel(order).save();
  }
}
