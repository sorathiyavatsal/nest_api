import * as mongoose from 'mongoose';
let ObjectId = mongoose.Types.ObjectId;
export const InvoiceSchema = new mongoose.Schema(
  {
    method: {
      type: String,
      required: true,
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
  },
  { timestamps: true },
);

export interface Invoice extends mongoose.Document {
  _id: string;
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
