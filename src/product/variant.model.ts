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
  options: [];
  Image: string;
  status: boolean;
}
