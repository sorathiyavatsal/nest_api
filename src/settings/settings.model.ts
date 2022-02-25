import * as mongoose from 'mongoose';
import * as bcrypt from 'bcrypt';
let Schema = mongoose.Types,
  ObjectId = Schema.ObjectId;
export const SettingsSchema = new mongoose.Schema(
  {
    metaKey: { type: String },
    metaValue: mongoose.Schema.Types.Mixed
    
  
  },
  { timestamps: true },
);

export interface Settings extends mongoose.Document {
  _id: string;
  metaKey: string;
  metaValue: Array<Object>;
  updatedAt: Date;
  createdAt: Date;
}
