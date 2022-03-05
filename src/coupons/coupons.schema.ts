import * as mongoose from 'mongoose';
import * as bcrypt from 'bcrypt';
let Schema = mongoose.Types,
  ObjectId = Schema.ObjectId;
export const CouponsSchema = new mongoose.Schema(
  {
    coupoun_name: {
      type: Object,
    },
    coupoun_code: {
      type: String,
    },
    coupon_expiration: {
      type: Date,
    },
    coupon_usablenumber:{
      type: Number,
    },
    createdBy: {
      type: ObjectId,
      ref: 'Users',
    },
    modifiedBy: {
      type: ObjectId,
      ref: 'Users',
    },
  },

  { timestamps: true },
);

export interface Coupons extends mongoose.Document {
  coupoun_name: string;
  coupoun_code: string;
  coupon_expiration: string;
  coupon_usablenumber:number;
}
