import * as mongoose from 'mongoose';
let ObjectId = mongoose.Types.ObjectId;
export const OrderSchema = new mongoose.Schema(
  {
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
    },
    shipingAddress: {
        type: Object,
    },
    billingAddress: {
        type: Object,
    },
    shippingId: {
        type: ObjectId,
        $ref: 'Users'
    },
    paymentTransactionId: {
        type: ObjectId,
        $ref: 'Invoices'
    },
  },
  { timestamps: true },
);

export interface Order extends mongoose.Document {
  _id: string;
  orderType: string;
  orderDate: Date;
  orders: object;
  subTotal: number;
  tax: object;
  copouns: [];
  shipingAddress: object;
  billingAddress: object;
  shippingId: mongoose.ObjectId;
  paymentTransactionId: mongoose.ObjectId;
}
