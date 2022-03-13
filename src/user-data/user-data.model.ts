import * as mongoose from 'mongoose';
import * as bcrypt from 'bcrypt';
import { type } from 'os';
let Schema = mongoose.Types,
  ObjectId = Schema.ObjectId;
export const UserDataSchema = new mongoose.Schema(
  {
    profile_photo: {
      type: Object,
    },
    userId: {
      type: ObjectId,
      required: true,
      unique: true,
      ref: 'Users',
    },
    fullName: {
      type: String,
      required: false,
    },
    gender: {
      type: String,
      enum: ['Male', 'Female', 'Others'],
    },
    dob: {
      type: Date,
      required: false,
    },
    shop_name: {
      type: String,
      required: false,
    },
    shop_address: {
      type: String,
      required: false,
    },
    sell_items: {
      type: Object,
    },

    adharcard_no: {
      type: String,
    },

    pancard_no: {
      type: String,
    },
    job_type: {
      type: String,
      enum: ['FULLTIME', 'HOURLY', 'FLAT'],
    },
    profile_type: {
      type: String,
      enum: ['User', 'Store'],
    },
    gst_no: {
      type: String,
    },
    driving_card: {
      type: String,
    },
    vehicle_no: {
      type: String,
    },
    vehicle_type: {
      type: String,
    },
    bank_details: {
      bank_account_no: { type: String, required: false },

      bank_account_holer_name: { type: String, required: false },

      bank_name: { type: String, required: false },

      ifsc_code: { type: String, required: false },
    },
    license: {
      type: String,
    },
    license_image: {
      type: String,
    },
    store_license: {
      type: String,
    },
    store_license_image: {
      type: String,
    },
    vehicle_image: {
      type: String,
    },
    store_no_image: {
      type: String,
    },
    aadhar_card_image: {
      type: String,
    },
    driving_card_image: {
      type: String,
    },
    pan_card_image: {
      type: String,
    },

    services_area: {
      type: Array,
    },
    createdBy: {
      type: ObjectId,
      ref: 'Users',
    },
    modifiedBy: {
      type: ObjectId,
      ref: 'Users',
    },
    shop_Lat_Long: {
      type: Array,
    },
    categoryId: {
      type: ObjectId,
      ref: 'categories',
    },
    delegate_access: {
      type: Array,
    },
    primary_language: {
      type: String,
    },
    secondary_language: {
      type: String,
    },
    store_timing: {
      type: Array,
    },
    review: {
      type: Array,
    },
    avgreview: {
      type: Number,
    },
    partnerId: {
      type: ObjectId,
      required: false,
      ref: 'Users',
    },
  },
  { timestamps: true },
);

export interface UserData extends mongoose.Document {
  _id: string;
  profile_photo: object;
  profile_type: string;
  gender: string;
  dob: Date;
  fullName: string;
  shop_name: string;
  shop_address: string;
  sell_items: string;
  adharcard_no: string;
  pancard_no: string;
  gst_no: string;
  store_license: string;
  bank_details: object;
  services_area: [];
  activeStatus: boolean;
  updatedAt: Date;
  createdAt: Date;
  createdBy: string;
  modifiedBy: string;
  store_license_image: object;
  aadhar_card_image: object;
  pan_card_image: object;
  vehicle_no: string;
  driving_card: string;
  vehicle_type: string;
  vehicle_image: object;
  driving_card_image: object;
  shop_Lat_Long: [];
  categoryId: String;
  delegate_access: [];
  primary_language: String;
  secondary_language: String;
  store_timing: [];
  review: [];
  avgreview: number;
  userId: mongoose.ObjectId;
  partnerId: mongoose.ObjectId
}
