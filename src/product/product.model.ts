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
      type: ObjectId,
      $ref: 'userdatas',
    },
    storeCategory: {
      type: ObjectId,
      $ref: 'categories',
    },
    category: {
      type: ObjectId,
      $ref: 'categories',
    },
    collections: {
      type: ObjectId,
      $ref: 'categories',
    },
    brand: {
      type: ObjectId,
      $ref: 'brand',
    },
    keywords: {
      type: String,
    },
    menu: {
      type: ObjectId,
      $ref: 'menu',
      required: false,
    },
    type: {
      type: String,
    },
    review: {
      type: Array,
    },
    avgreview: {
      type: Number,
    },
    parentId: {
      type: String,
    },
    addon: {
      type: Array,
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
  store: mongoose.ObjectId;
  category: mongoose.ObjectId;
  collections: mongoose.ObjectId;
  brand: mongoose.ObjectId;
  status: boolean;
  keywords: string;
  menu: string;
  type: string;
  review: [];
  addon: [];
  parentId: string;
  avgreview: number;
}
