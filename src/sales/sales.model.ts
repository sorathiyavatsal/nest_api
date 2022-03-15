import * as mongoose from 'mongoose';
let ObjectId = mongoose.Types.ObjectId;
export const SalesSchema = new mongoose.Schema(
  {
    invoiceId: {
        type: ObjectId,
        ref: 'PurchaseInvoice',
        required: true,
    },
    storeId: {
      type: ObjectId,
      ref: 'User',
      required: true,
    },
    salesAmount : {
        type: Number,
    },
    platformCommission: {
      type: Number,
    },
    grossIncome: {
      type: Number,
    },
    settlementStatus: {
      type: Boolean,
      default: false
    }
  },
  { timestamps: true },
);

export interface Sales extends mongoose.Document {
  _id: string;
  invoiceId: mongoose.ObjectId;
  storeId: mongoose.ObjectId;
  salesAmount: number;
  platformCommission: number;
  grossIncome: number;
  settlementStatus: boolean;
}
