import * as mongoose from 'mongoose';
import * as bcrypt from 'bcrypt';
let Schema = mongoose.Types,
  ObjectId = Schema.ObjectId;
  
export const AdsSchema = new mongoose.Schema(
  {
    title: {
      type: String,
    },
    description: {
      type: String,
    },
    image: {
      type: Array,
    },
    expiryDate: {
      type: String,
    },
    promotion_for_coupon: {
        type: String,
      },
  },
  { timestamps: true },
);
​
export interface Ads extends mongoose.Document {
  _id: string;
  title: string,
  description: string,
  image: [],
  expiryDate: string,
  promotion_for_coupon: string;
}