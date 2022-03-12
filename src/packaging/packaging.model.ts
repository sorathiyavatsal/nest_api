import * as mongoose from 'mongoose';
import * as bcrypt from 'bcrypt';
let Schema = mongoose.Types,
  ObjectId = Schema.ObjectId;
export const PackagingsSchema = new mongoose.Schema(
  {
    category: {
      type: ObjectId,
      required: true,
      ref: 'Goods',
    },
    rate: {
      type: Number,
      required: false,
    },

    activeStatus: {
      type: Boolean,
      default: true,
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

export interface Packagings extends mongoose.Document {
  _id: string;
  category: string;
  rate: number;
  activeStatus: boolean;
  updatedAt: Date;
  createdAt: Date;
  createdBy: string;
  modifiedBy: string;
}
