import * as mongoose from 'mongoose';
import * as bcrypt from 'bcrypt';
import { type } from 'os';
let Schema = mongoose.Schema,
  ObjectId = Schema.ObjectId;
export const ProfileSchema = new mongoose.Schema(
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
      enum: ['FULLTIME', 'PARTTIME'],
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
    bank_details: [
      {
        bank_account_no: { type: Number, required: false },

        bank_account_holer_name: { type: String, required: false },

        bank_name: { type: String, required: false },

        ifsc_code: { type: String, required: false },
      },
    ],

    store_license_image: {
      type: Object,
    },
    vehicle_image: {
      type: Object,
    },
    store_no_image: {
      type: Object,
    },
    aadhar_card_image: {
      type: Object,
    },
    driving_card_image: {
      type: Object,
    },
    pan_card_image: {
      type: Object,
    },

    services_area: {
      type: Object,
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

export interface Profile extends mongoose.Document {
  _id: string;
  profile_photo: object,
  gender: string,
  dob: Date,
  fullName: string,
  shop_name: string,
  shop_address: string,
  sell_items: string,
  adharcard_no: string,
  pancard_no: string,
  gst_no: string,
  store_license: string,
  bank_details: object,
  services_area: object,
  activeStatus: boolean,
  updatedAt: Date,
  createdAt: Date,
  createdBy: string,
  modifiedBy: string
}
