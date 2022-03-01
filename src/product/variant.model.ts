import * as mongoose from 'mongoose';
import * as bcrypt from 'bcrypt';
import { type } from 'os';
let Schema = mongoose.Types,
  ObjectId = Schema.ObjectId;
export const VariantSchema = new mongoose.Schema(
  {
    name: {
      type: String,
    },
    type: {
      type: Boolean,
    },
    options: {
      type: Array,
    },
    Image: {
      type: String,
    },
    status: {
      type: Boolean,
    },
  },
  { timestamps: true },
);

export interface Variant extends mongoose.Document {
  _id: string;
  name: string;
  type: boolean;
  options: [];
  Image: string;
  status: boolean;
}
