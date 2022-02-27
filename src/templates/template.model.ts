import * as mongoose from 'mongoose';
import * as bcrypt from 'bcrypt';
let Schema = mongoose.Types,
  ObjectId = Schema.ObjectId;
export const TemplateSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      enum: [
        'REGISTER',
        'LOGIN',
        'RESET_PASSWORD',
        'FORGOT_PASSWORD',
        'LOGIN_OTP_VERIFICATION',
        'DELIVERY_FLEET_ORDER_ACCEPTED',
        'DELIVERY_INPROGRESS',
        'DELIVERY_DELIVERED',
        'DELIVERY_PICKUP_OTP',
        'DELIVERY_DELIVERED_OTP',
        'ACCOUNT_APPROVED',
        'ACCOUNT_REJECTED',
        'API_ACCESS_KEY',
      ]
    },
    content: {
      type: String,
    },
    emailSubject: {
      type: String,
      required: false
    },
    type: {
      type: String,
      enum: [
        'SMS',
        'EMAIL',
      ],
      default: 'EMAIL'
    },
    activeStatus: {
      type: Boolean,
      default: false,
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
TemplateSchema.index({ content: 'text' });
export interface Template extends mongoose.Document {
  _id: string;
  name: string;
  content: string;
  emailSubject: string;
  type: string;
  activeStatus: boolean;
  createdBy: string;
  modifiedBy: string;
}
