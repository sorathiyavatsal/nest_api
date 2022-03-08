import * as mongoose from 'mongoose';
let ObjectId = mongoose.Types.ObjectId;
export const SettlementSchema = new mongoose.Schema(
  {
    deliveryBoy: {
        type: String
    },
    workInHours: {
        type: Number
    },
    travelledKM: {
        type: Number
    },
    payAmount: {
        type: Number
    },
    bankName: {
        type: String
    },
    bankAccNo: {
        type: String
    },
    bankIFSC: {
        type: String
    },
    inputDate: {
        type: Date
    },
    amountPay: {
        type: Number
    },
    receiptId: {
        type: ObjectId
    },
  },
  { timestamps: true },
);

export interface Settlement extends mongoose.Document {
  _id: string;
  deliveryBoy: string;
  workInHours: number;
  travelledKM: number;
  payAmount: number;
  bankName: string;
  bankAccNo: string;
  bankIFSC: string;
  inputDate: Date;
  amountPay: number;
  receiptId: mongoose.ObjectId;
}
