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
      type: String,
    },
    text: {
      type: String,
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
  image: string;
  text: string;
  status: string;
}
