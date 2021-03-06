import * as mongoose from 'mongoose';
let ObjectId = mongoose.Types.ObjectId;
export const PruchaseOrderSchema = new mongoose.Schema(
  {
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
    },
    status: {
      type: String,
    },
  },
  { timestamps: true },
);

export interface PruchaseOrder extends mongoose.Document {
  _id: string;
  consumerId: mongoose.ObjectId;
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
  paymentTransactionId: string;
  status: string;
}
