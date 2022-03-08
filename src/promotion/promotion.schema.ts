import * as mongoose from 'mongoose';
import * as bcrypt from 'bcrypt';
let Schema = mongoose.Types,
  ObjectId = Schema.ObjectId;
export const PromotionSchema = new mongoose.Schema(
  {
    name: {
      type: String,
    },
    description: {
      type: String,
    },
    image: {
      type: String,
    },
    target: {
      type: Object,
    },
    promotion_for_coupon: {
      type: String,
    },
    type: {
      type: String,
    },
    
    placement: { type: Object },
    date: { type: Object },
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
​
export interface Promotion extends mongoose.Document {
  _id: string;
  name: string,
  description: string,
  image: string,
  target: Array<object>,
  promotion_for_coupon: string,
  type: string,
  placement: object,
  date: object,
  
}