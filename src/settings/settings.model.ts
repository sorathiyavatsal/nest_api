import * as mongoose from 'mongoose';
import * as bcrypt from 'bcrypt';
let Schema = mongoose.Types,
  ObjectId = Schema.ObjectId;
export const SettingsSchema = new mongoose.Schema(
  {
    name: {
      type: String
    },
    fuel_charge_array: { type: Array },
    delivery_service_array: { type: Array },
    fleet_tax: {
      type: Number
    }
  },
  { timestamps: true }
);

export interface Settings extends mongoose.Document {
  _id: string;
  name: string;
  fleet_tax: number;
  fuel_charge_array: Array<Object>,
  delivery_service_array: Array<Object>;
  updatedAt: Date;
  createdAt: Date;
}
