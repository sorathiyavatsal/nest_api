import * as mongoose from 'mongoose';
import * as bcrypt from 'bcrypt';
let Schema = mongoose.Schema,
  ObjectId = Schema.ObjectId;
export const CouponsSchema = new mongoose.Schema(
  {
    coupoun_name: {
      type: Object,
    },
    coupoun_code: {
      type: String,
    },
    promotion_id: {
      type: ObjectId,
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

export interface Coupouns extends mongoose.Document {
  _id: string;
  coupoun_name: string;
  coupoun_code: string;
  promotion_id: string;
}
