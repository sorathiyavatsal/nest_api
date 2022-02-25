import * as mongoose from 'mongoose';
import * as bcrypt from 'bcrypt';
import { type } from 'os';
let Schema = mongoose.Types,
  ObjectId = Schema.ObjectId;
export const ProductSchema = new mongoose.Schema(
  {
    name: {
      type: String,
    },
    secondary_name: {
      type: String,
    },
    description: {
      type: String,
    },
    pageTitle: {
      type: String,
    },
    Variant: {
      type: Array,
    },
    metaDescription: {
      type: String,
    },
    urlHandle: {
      type: String,
    },
    productImage: {
      type: Array,
    },
    store: {
      type: String,
      $ref: 'categories',
    },
    category: {
      type: String,
      $ref: 'categories',
    },
    collections: {
      type: String,
      $ref: 'categories',
    },
    brand: {
      type: String,
      $ref: 'brand',
    },
    status: {
      type: Boolean,
    },
  },
  { timestamps: true },
);

export interface Product extends mongoose.Document {
  _id: string;
  name: string;
  secondary_name: string;
  description: string;
  pageTitle: string;
  Variant: [];
  metaDescription: string;
  urlHandle: string;
  productImage: [];
  store: string;
  category: string;
  collections: string;
  brand: string;
  status: boolean;
}
