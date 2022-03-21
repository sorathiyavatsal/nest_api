import * as mongoose from 'mongoose';
let ObjectId = mongoose.Types.ObjectId;
export const NotificationSchema = new mongoose.Schema(
  {
    userId: {
      type: ObjectId,
      $ref: 'Users',
    },
    type: {
      type: String,
    },
    operation: {
      type: String,
    },
    deviceId: {
      type: String,
    },
    title: {
      type: String,
    },
    content: {
      type: String,
    },
    status: {
      type: String,
    },
    extraData: {
      type: Object,
    },
  },
  { timestamps: true },
);

export interface Notification extends mongoose.Document {
  userId: mongoose.ObjectId;
  type: string;
  operation: string;
  deviceId: string;
  title: string;
  content: string;
  status: string;
  extraData: object;
}
