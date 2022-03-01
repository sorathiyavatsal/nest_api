import * as mongoose from 'mongoose';
let Schema = mongoose.Types,
  ObjectId = Schema.ObjectId;

export const catalogueSchema = new mongoose.Schema(
  {
    productId: {
      type: ObjectId,
      required: true,
      $ref: 'products',
    },
    storeId: {
      type: ObjectId,
      required: true,
      $ref: 'userdatas',
    },
    catalogueStatus: {
      type: Boolean,
      default: true,
    },
    variants: {
      type: Array,
      format: ObjectId,
      $ref: 'variants',
    },
    variantoptions: {
      type: Array,
      format: ObjectId,
      $ref: 'variantoptions',
    },
  },
  { timestamps: true },
);

export interface catalogue extends mongoose.Document {
  _id: string;
  productId: string;
  storeId: string;
  catalogueStatus: Boolean;
  variants: [];
  variantoptions: [];
  updatedAt: Date;
  createdAt: Date;
}
