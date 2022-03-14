import * as mongoose from 'mongoose';
import * as bcrypt from 'bcrypt';
import { type } from 'os';
let Schema = mongoose.Types,
  ObjectId = Schema.ObjectId;
export const VariantOptionsSchema = new mongoose.Schema(
  {
    variant_id: {
      type: String,
    },
    value: {
      type: String,
    },
    image: {
      type: Array,
    },
    text: {
      type: String,
    },
    mrpprice: {
      type: Number,
    },
    salepprice: {
      type: Number,
    },
    qty: {
      type: Number,
    },
    status: {
      type: Boolean,
    },
  },
  { timestamps: true },
);

export interface VariantOptions extends mongoose.Document {
  _id: string;
  variant_id: string;
  value: string;
  image: [];
  text: string;
  mrpprice: number;
  salepprice: number;
  qty: number;
  status: string;
}
