import * as mongoose from 'mongoose';

export const StoreSchema = new mongoose.Schema(
  {
    name: {
        type: String,
        required: true,
    },
    contact: {
        type: Number,
        required: true,
    },
    address: {
        type: Object,
    },
    allocated_DAs: {
        type: Array,
        ref: 'Users',
    },
    allocated_zipcodes: {
        type: Array,
    },
    status: {
        type: Boolean,
        required: true,
        default: true
    },
  },
  { timestamps: true },
);

export interface Store extends mongoose.Document {
  _id: string;
  name: string;
  contact: number;
  address: Object;
  allocated_DAs: [];
  allocated_zipcodes: [];
  status: boolean;
}
