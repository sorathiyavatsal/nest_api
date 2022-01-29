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
    coupon_id:{
     type:ObjectId,
     ref:"Coupons",
    },
    applicable_price:{
      type:Number,
      required:true,
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
    promotion_target_user_no:{
        type: Number
    },
    promotion_flat_offer:{
        type: Number
    },
    promotion_condition_offer:{
        type: Object
    },
    promotion_percentage_offer:{
        type: Number
    },
    promotion_used_user_no:{
        type: Number
    },
    promotion_applied_by:{
        type: Array,
        ref: "User"
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
    promotion_target_gender:{
        type: String
    },
    promotion_target_location:{
        type: String
    },
    promotion_target_age:{
        type: String
    },
    promotion_start_date:{
        type: Date,
    },
    promotion_end_date:{
        type: Date,
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
  promotion_percentage_offer: any;
  promotion_flat_offer: any;
  promotion_type: string;
  _id: string;
  coupoun_name: string;
  coupoun_code: string;
  promotion_id: string;
}
