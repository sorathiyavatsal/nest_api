import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { PruchaseOrder } from './order.model';
let ObjectId = require('mongodb').ObjectId;

@Injectable()
export class OrderService {
  constructor(@InjectModel('PruchaseOrder') private OrderModel: Model<PruchaseOrder>) {}

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
    let orders_details = [];
    if (orderDto.orders) {
      orderDto.orders.forEach((order) => {
        orders_details.push({
          id: ObjectId(order.id),
          quantity: order.quantity,
          sellPrice: order.sellPrice,
          discount: order.discount,
        });
      });
    }

    let copouns = [];
    if (orderDto.copouns) {
      orderDto.copouns.forEach((copoun) => {
        copouns.push(ObjectId(copoun));
      });
    }

    let order = {
      orderType: orderDto.orderType,
      orderDate: orderDto.orderDate,
      orders: orders_details,
      subTotal: orderDto.subTotal,
      tax: orderDto.tax,
      copouns: copouns,
      shipingAddress: orderDto.shipingAddress,
      billingAddress: orderDto.billingAddress,
      shippingId: ObjectId(orderDto.shippingId),
      paymentTransactionId: ObjectId(orderDto.paymentTransactionId),
    };

    return await new this.OrderModel(order).save();
  }
}
