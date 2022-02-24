import * as mongoose from 'mongoose';
import * as bcrypt from 'bcrypt';
import { type } from 'os';
let Schema = mongoose.Types,
  ObjectId = Schema.ObjectId;
export const VariantSchema = new mongoose.Schema(
  {
    meta_key: {
      type: String,
    },
    meta_value: {
      type: String,
    },
    meta_type: {
      type: Boolean,
    },
    meta_options: {
      type: Array,
    },
    meta_status: {
      type: Boolean,
    },
  },
  { timestamps: true },
);

export interface Variant extends mongoose.Document {
  _id: string;
  meta_key: string;
  meta_value: string;
  meta_type: boolean;
  meta_options: [];
  meta_status: boolean;
}
