import * as mongoose from 'mongoose';
let ObjectId = mongoose.Types.ObjectId;
export const SellOrderSchema = new mongoose.Schema(
  {
    purchase_order_id: {
        type: ObjectId,
      $ref: 'pruchaseorders',
    },
    consumerId: {
      type: ObjectId,
      $ref: 'Users',
    },
    orderType: {
      type: String,
    },
    orderDate: {
      type: Date,
    },
    orders: {
      type: Object,
    },
    subTotal: {
      type: Number,
    },
    tax: {
      type: Object,
    },
    copouns: {
      type: Array,
      $ref: 'coupons',
    },
    shipingAddress: {
      type: Object,
    },
    billingAddress: {
      type: Object,
    },
    shippingId: {
      type: ObjectId,
      $ref: 'deliveryfleets',
    },
    cor: {
      type: Number,
    },
    paymentTransactionId: {
        type: String,
    }
  },
  { timestamps: true },
);

export interface SellOrder extends mongoose.Document {
  _id: string;
  consumerId: mongoose.ObjectId,
  orderType: string;
  orderDate: Date;
  orders: object;
  subTotal: number;
  tax: object;
  copouns: [];
  shipingAddress: object;
  billingAddress: object;
  shippingId: mongoose.ObjectId;
  cor: number;
  paymentTransactionId: string
}
