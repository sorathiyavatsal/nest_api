import * as mongoose from 'mongoose';
import * as bcrypt from 'bcrypt';
let Schema = mongoose.Types,
  ObjectId = Schema.ObjectId;

export const AdsViewSchema = new mongoose.Schema(
  {
    title: {
      type: String,
    },
    deviceInformation: {
      type: Object,
    },
    ipaddress: {
      type: String,
    },
    userId: {
      type: ObjectId,
      $ref: 'users'
    },
    promotionId: {
      type: ObjectId,
      $ref: 'promotions'
    },
    adsId: {
      type: ObjectId,
      $ref: 'ads'
    },
  },
  { timestamps: true },
);
export interface AdsView extends mongoose.Document {
  _id: string;
  device: string;
  deviceInformation: Object;
  ipaddress: string;
  userId: mongoose.ObjectId;
  promotionId: mongoose.ObjectId;
  adsId: mongoose.ObjectId;
}
