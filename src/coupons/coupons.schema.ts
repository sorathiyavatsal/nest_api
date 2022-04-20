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
    discount_amount: {
      type: Number,
    },
    discount_type: {
      type: String,
    },
    coupon_conditional: { type: Boolean},
    coupon_condition_percent:{
      type: Object 
    },
    coupon_condition_flat:{
      type: Object
    },
    createdBy: {
      type: ObjectId,
      ref: 'Users',
    },
    modifiedBy: {
      type: ObjectId,
      ref: 'Users',
    },
    image: {
        type: String
    }
  },

  { timestamps: true },
);

export interface Coupons extends mongoose.Document {
  coupoun_name: string;
  coupoun_code: string;
  coupon_usablenumber:number;
  coupon_expiration: string;
  discount_amount: number;
  discount_type: string;
  coupon_conditional:boolean;
  coupon_condition_percent: object;
  coupon_condition_flat: object;
  image: string;
}
