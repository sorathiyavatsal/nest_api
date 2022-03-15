import * as mongoose from 'mongoose';
let ObjectId = mongoose.Types.ObjectId;
export const RevenueSchema = new mongoose.Schema(
  {
    invoiceId: {
      type: ObjectId,
      ref: 'PurchaseInvoice',
      required: true,
  },
    revenueType : {
      type: String,
      enum: [
        'STORE',
        'FLEET',
      ],
    },
    revenueFrom: {
      storeId: {
        type: ObjectId,
        ref: 'User',
      },
      deliveryFleetId: {
        type: ObjectId,
        ref: 'DeliveryFleet',
      },
    },
    revenueAmount: {
      type: Number
    }
  },
  { timestamps: true },
);

export interface Revenue extends mongoose.Document {
  _id: string;
  invoiceId: mongoose.ObjectId;
  revenueFrom: {
    storeId: mongoose.ObjectId;
    fleetCommissionId: mongoose.ObjectId;
  };
  revenueType: string;
  revenueAmount: number;
}
