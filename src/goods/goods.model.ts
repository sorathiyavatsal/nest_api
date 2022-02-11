import * as mongoose from 'mongoose';
let Schema = mongoose.Types,
  ObjectId = Schema.ObjectId;
export const GoodsSchema = new mongoose.Schema(
  {
    image: {
      type: Object,
    },
    svgImage: {
      type: String,
    },
    orderNumber: {
      type: Number,
      default: 1,
    },
    name: {
      type: String,
      unique: true,
      required: true,
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

export interface Good extends mongoose.Document {
  _id: string;
  name: string;
  rate: number;
  image: object;
  svgImage: string;
  activeStatus: boolean;
  updatedAt: Date;
  createdAt: Date;
  createdBy: string;
  modifiedBy: string;
}
