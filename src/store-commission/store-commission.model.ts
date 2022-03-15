import * as mongoose from 'mongoose';
let ObjectId = mongoose.Types.ObjectId;
export const StoreCommissionSchema = new mongoose.Schema(
  {
    planCode: {
        type: String,
        required: true,
    },
    category:[{
      categoryId: {
        type: ObjectId,
        ref: 'Category',
        required: true,
      },
      commissionAmount: mongoose.Schema.Types.Mixed,
    }],
    applicableType : {
        type: String,
        enum: [
          'INVOICE',
          'CATEGORY',
        ],
    },
    commissionType: {
      type: String,
      enum: [
        'GENERAL',
        'RANGE',
      ],
    },
    commissionAmountType: {
      type: Boolean,
    },
    description: {type: String},
  },
  { timestamps: true },
);

export interface StoreCommission extends mongoose.Document {
  _id: string;
  planCode: string;
  category: [{
    categoryId: mongoose.ObjectId;
    commissionAmount: Array<Object>;
  }];
  applicableType: string;
  commissionType: string;
  commissionAmountType: boolean;
  description: string;
}
