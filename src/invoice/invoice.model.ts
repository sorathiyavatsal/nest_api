import * as mongoose from 'mongoose';
let ObjectId = mongoose.Types.ObjectId;
export const PurchaseInvoiceSchema = new mongoose.Schema(
  {
    invoiceId: {
        type: String,
        required: true,
    },
    method: {
      type: String,
      required: true,
    },
    invoiceStatus : {
        type: String,
        required: true
    },
    transationId: {
      type: String,
    },
    paymentGatewayId: {
      type: String,
    },
    paymentGatewayStatus: {
      type: String,
    },
    paidId: {
      type: ObjectId,
      $ref: 'Users'
    },
    paidBy: {
      type: String,
    },
    receiveId: {
      type: ObjectId,
      $ref: 'Users'
    },
    receiceBy: {
      type: String,
    },
    amount: {
      type: Number,
    },
    charges: {
      type: Number,
    },
    orderId: {
        type: ObjectId,
        $ref: 'pruchaseorders'
    }
  },
  { timestamps: true },
);

export interface PurchaseInvoice extends mongoose.Document {
  _id: string;
  invoiceId: string;
  invoiceStatus: string;
  method: string;
  transationId: string;
  paymentGatewayId: string;
  paymentGatewayStatus: string;
  paidId: string;
  paidBy: string;
  receiveId: string;
  receiceBy: string;
  amount: number;
  charges: number;
}
