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
import { SellOrder } from './sellorder.model';

@Injectable()
export class OrderService {
  constructor(
    @InjectModel('PurchaseOrder') private OrderModel: Model<PruchaseOrder>,
    @InjectModel('SellOrder') private SellOrderModel: Model<SellOrder>,
    @InjectModel('catalogue') private catalogueModel: Model<catalogue>,
    @InjectModel('Products') private ProductsModel: Model<Product>,
    @InjectModel('User') private userModel: Model<User>,
    @InjectModel('UserData') private userDataModel: Model<UserData>,
    @InjectModel('Notification') private NotificationModel: Model<Notification>,
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
    let order_consumer = {};
    if (orderDto.orders) {
      for (var i = 0; i < orderDto.orders.length; i++) {
        var order_details = {
          id: ObjectId(),
          quantity: orderDto.orders[i].quantity,
          sellPrice: orderDto.orders[i].sellPrice,
          discount: orderDto.orders[i].Discount,
        };

        if (orderDto.orders[i].storeId) {
          order_details['storeId'] = ObjectId(orderDto.orders[i].storeId);
        }

        if (orderDto.orders[i].variantId) {
          order_details['variantId'] = ObjectId(orderDto.orders[i].variantId);
        }

        if (orderDto.orders[i].catalogueId) {
          order_details['catalogueId'] = ObjectId(
            orderDto.orders[i].catalogueId,
          );
        }

        orders_details.push(order_details);
        if (order_consumer[orderDto.orders[i].storeId]) {
          order_consumer[orderDto.orders[i].storeId].push(order_details);
        } else {
          order_consumer[orderDto.orders[i].storeId] = [order_details];
        }
      }
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

    const orderResult = await new this.OrderModel(order).save();

    for (var key in order_consumer) {
      var ordersRes = JSON.parse(JSON.stringify(orderResult));
      ordersRes['orders'] = order_consumer[key];
      ordersRes['storeId'] = ObjectId(key);
      delete ordersRes._id;
      await new this.SellOrderModel(ordersRes).save();

      var amount = 0;
      for(var i = 0; i < order_consumer[key].length; i++) {
        amount = amount + order_consumer[key]['sellPrice'] 
      }

      const store = await this.userDataModel.findOne({
          _id: ObjectId(key)
      })

      const notificationDto = {
        title: 'You got order',
        body: `you got ₹${amount} order`,
      };

      const headers = JSON.parse(
        JSON.stringify({
          Authorization:
            'key=AAAArNJ8-t4:APA91bGZqcqwoLz5KbGglrq34TOqeTISkvxbSB0v3v4eI5O6eBXZZGX3qngVaPrfKYN3bIdc6N1N0bW19rofHqhWaQwrR77GZ9z9KhAYNYucckLSOJe9N0iUQuLIyrgwtxBTss5-aQ68',
          'Content-Type': 'application/json',
        }),
      );

      const body = JSON.parse(
        JSON.stringify({
          notification: {
            title: notificationDto.title,
            body: notificationDto.body,
          },
          registration_ids: [store['deviceId']],
        }),
      );

      const data = await axios({
        method: 'POST',
        url: 'https://fcm.googleapis.com/fcm/send',
        data: body,
        headers: headers,
      });

      new this.NotificationModel(notificationDto).save();
    }

    return orderResult;
  }
}
