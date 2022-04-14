import * as mongoose from 'mongoose';
let ObjectId = mongoose.Types.ObjectId;
export const StoreCommissionSchema = new mongoose.Schema(
  {
    planCode: {
      type: String,
      required: true,
    },
    values: Array,
    applicableType: {
      type: String,
      enum: ['INVOICE', 'CATEGORY'],
    },
    commissionType: {
      type: String,
      enum: ['GENERAL', 'RANGE'],
    },
    description: { type: String },
    status: {
      type: Boolean,
    },
  },
  { timestamps: true },
);

export interface StoreCommission extends mongoose.Document {
  _id: string;
  planCode: string;
  values: [];
  applicableType: string;
  commissionType: string;
  description: string;
  status: boolean;
}
