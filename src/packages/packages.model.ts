import * as mongoose from 'mongoose';
let ObjectId = mongoose.Types.ObjectId;
export const PackagesSchema = new mongoose.Schema(
  {
    category: {
      type: ObjectId,
      required: true,
      ref: 'Category',
    },
    from_pack: {
      type: Number,
      required: false,
    },
    to_pack: {
      type: Number,
      required: false,
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

export interface Packages extends mongoose.Document {
  _id: string;
  category: string;
  from_pack: number;
  to_pack: number;
  activeStatus: boolean;
  rate: number;
  updatedAt: Date;
  createdAt: Date;
  createdBy: string;
  modifiedBy: string;
}
