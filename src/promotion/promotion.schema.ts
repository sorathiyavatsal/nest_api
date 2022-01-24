import * as mongoose from 'mongoose';
import * as bcrypt from 'bcrypt';
let Schema = mongoose.Schema,
  ObjectId = Schema.ObjectId;
export const PromotionSchema = new mongoose.Schema(
  {
    promotion_name: {
      type: Object,
    },
    promotion_description: {
      type: String,
    },
    promotion_image: {
      type: String,
    },
    promotion_content_type: {
      type: String,
    },
    merchant_id: {
      type: ObjectId,
      ref: 'Users',
    },
    promotion_target_type: {
      type: String,
      enum: ['merchant', 'global'],
    },
    promotion_Device_type: {
      type: String,
      enum: ['All', 'Web', 'Mobile'],
    },
    promotion_user_type: {
      type: String,
      enum: ['Delivery', 'Merchant', 'Consumer'],
    },
    promotion_type: {
      type: String,
      enum: ['flat', 'percentage'],
    },
    promotion_target_filters: {
      type: Object,
      default: {
        location: false,
        gender: false,
        age: false,
      },
    },
    promotion_target_users_by: {
      type: String,
      enum: ['gender', 'location', 'age'],
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

export interface Promotion extends mongoose.Document {
  _id: string;
  coupoun_name: string;
  coupoun_code: string;
  promotion_id: string;
}
