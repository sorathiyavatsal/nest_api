import * as mongoose from 'mongoose';
import * as bcrypt from 'bcrypt';
let Schema = mongoose.Types,
  ObjectId = Schema.ObjectId;
export const RoleSchema = new mongoose.Schema(
  {
    role: {
      type: String,
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

export interface Role extends mongoose.Document {
  _id: string;
  role: string;
  activeStatus: boolean;
  updatedAt: Date;
  createdAt: Date;
  createdBy: string;
  modifiedBy: string;
}
