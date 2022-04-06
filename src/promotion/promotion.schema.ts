import * as mongoose from 'mongoose';
import * as bcrypt from 'bcrypt';
let Schema = mongoose.Types,
  ObjectId = Schema.ObjectId;
export const PromotionSchema = new mongoose.Schema(
  {
    network: {
      type: String,
    },
    type: {
      type: String,
    },
    image: {
      type: String,
    },
    target: {
      type: Object,
    },
    ads: {
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
  ads: [],
  type: string,
  placement: object,
  date: object,
  
}