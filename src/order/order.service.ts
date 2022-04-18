import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from 'src/auth/user.model';
import { catalogue } from 'src/catalogue/catalogue.model';
import { Product } from 'src/product/product.model';
import { UserData } from 'src/user-data/user-data.model';
import { PruchaseOrder } from './order.model';
let ObjectId = require('mongodb').ObjectId;
var _ = require('underscore');
import axios from 'axios';

@Injectable()
export class OrderService {
  constructor(
    @InjectModel('PruchaseOrder') private OrderModel: Model<PruchaseOrder>,
    @InjectModel('catalogue') private catalogueModel: Model<catalogue>,
    @InjectModel('Products') private ProductsModel: Model<Product>,
    @InjectModel('User') private userModel: Model<User>,
    @InjectModel('UserData') private userDataModel: Model<UserData>,
  ) {}

  async getAllOrder(OrderDto: any) {
    var orders = await this.OrderModel.aggregate([
      {
        $lookup: {
          from: 'users',
          localField: 'consumerId',
          foreignField: '_id',
          as: 'consumerDetails',
        },
      },
      {
        $unwind: {
          path: '$consumerDetails',
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

    for (let i = 0; i < orders.length; i++) {
      const orderCount = orders[i].orders.length;
      for (let j = 0; j < orderCount; j++) {
        var data = await this.catalogueModel.findById(orders[i].orders[j].id);
        // var store = await this.userDataModel.findById(data.storeId);
        // var product = await this.ProductsModel.findById(data.productId);
        orders[i].orders[j]['details'] = data;
        // orders[i].orders[j]['store'] = store;
        // orders[i].orders[j]['product'] = product;
        // if (!product.name.includes(OrderDto.name)) {
        //   delete orders[i].orders[j];

        //   orders[i].orders = orders[i].orders.filter((element) => {
        //     return element !== null;
        //   });

        //   if (orders[i].orders.length <= 0) {
        //     delete orders[i];
        //   }
        // }
      }
    }

    orders = orders.filter((element) => {
      return element !== null;
    });

    if (OrderDto.to_date) {
      orders = _.filter(
        orders,
        (o) => new Date(o.orderDate) >= new Date(OrderDto.to_date),
      );
    }
    if (OrderDto.from_date) {
      orders = _.filter(
        orders,
        (o) => new Date(o.orderDate) <= new Date(OrderDto.from_date),
      );
    }

    if (OrderDto.id) {
      orders = _.filter(orders, (o) => o.consumerId == OrderDto.id);
    }

    return orders;
  }

  async getOrderId() {
    return {};
  }

  async getOrder(orderId: String) {
    var orders = await this.OrderModel.aggregate([
      {
        $lookup: {
          from: 'users',
          localField: 'consumerId',
          foreignField: '_id',
          as: 'consumerDetails',
        },
      },
      {
        $unwind: {
          path: '$consumerDetails',
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

    for (let i = 0; i < orders.length; i++) {
      for (let j = 0; j < orders[i].orders.length; j++) {
        var data = await this.catalogueModel.findById(orders[i].orders[j].id);
        if (data) {
          if (data.storeId) {
            var store = await this.userDataModel.findById(data.storeId);
            orders[i].orders[j]['store'] = store;
          }
          if (data.productId) {
            var product = await this.ProductsModel.findById(data.productId);
            orders[i].orders[j]['product'] = product;
          }
        }

        orders[i].orders[j]['details'] = data;
      }
    }
    return orders[0];
  }

  async postOrder(orderDto: any) {
    let orders_details = [];
    if (orderDto.orders) {
      orderDto.orders.forEach((order) => {
        orders_details.push({
          id: ObjectId(order.id),
          quantity: order.quantity,
          sellPrice: order.sellPrice,
          discount: order.Discount,
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
      _id: ObjectId(orderDto.orderId),
      consumerId: ObjectId(orderDto.consumerId),
      orderType: orderDto.orderType,
      orderDate: orderDto.orderDate,
      orders: orders_details,
      subTotal: orderDto.subTotal,
      status: orderDto.status ? orderDto.status : 'Pendding',
      shipingAddress: orderDto.shipingAddress,
      billingAddress: orderDto.billingAddress,
      paymentTransactionId: ObjectId(orderDto.paymentTransactionId),
    };

    if (orderDto.tax) {
      order['tax'] = orderDto.tax;
    }

    if (orderDto.shippingId) {
      order['shippingId'] = ObjectId(orderDto.shippingId);
    }

    if (copouns) {
      order['copouns'] = copouns;
    }

    // await axios({
    //     method: 'POST',
    //     url: `http://localhost:5000/api/notification/send`,
    //     headers: JSON.parse(
    //       JSON.stringify({
    //         Authorization: token,
    //       }),
    //     ),
    //     data: {
    //         type: 'GENERAL',
    //         operation: 'FLEET ASSIGNED',
    //         deviceId: deliveryBoy.deviceId,
    //         userId: deliveryBoy._id,
    //         title: 'Your Fleet Job',
    //         content: deliveryBoy.fullName + ' delivery boy accepted your delivery and some demons. text goes here and here and here',
    //         status: 'SEND',
    //         extraData: {
    //             notification_details: {
    //                 id: this.ObjectId(deliveryFleet._id),
    //                 type: 'FLEET',
    //                 status: 'Not Accepted'
    //             }
    //         }
    //     },
    //   });

    const orderResult = await new this.OrderModel(order).save();

    console.log(orderResult)

    return orderResult;
  }
}
