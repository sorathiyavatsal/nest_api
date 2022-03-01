import * as mongoose from 'mongoose';
import { type } from 'os';
let Schema = mongoose.Types,
  ObjectId = Schema.ObjectId;
export const reviewsSchema = new mongoose.Schema(
  {
    rating: {
      type: Number,
      required: true,
    },
    reviewedBy: {
      type: ObjectId,
    },
    reviewto: {
      type: ObjectId,
    },
    reviewType: {
      type: String,
    },
    comment: {
      type: String,
    },
  },
  { timestamps: true },
);

export interface reviews extends mongoose.Document {
  rating: number;
  reviewedBy: string;
  reviewto: string;
  comment: string;
  reviewType: string;
  updatedAt: Date;
  createdAt: Date;
}
