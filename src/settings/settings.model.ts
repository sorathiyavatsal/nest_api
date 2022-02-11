import * as mongoose from 'mongoose';
import * as bcrypt from 'bcrypt';
let Schema = mongoose.Types,
  ObjectId = Schema.ObjectId;
export const SettingsSchema = new mongoose.Schema(
  {
    delivery_service_array: { type: Array },
  },
  { timestamps: true },
);

export interface Settings extends mongoose.Document {
  _id: string;
  delivery_service_array: [];
  updatedAt: Date;
  createdAt: Date;
}
