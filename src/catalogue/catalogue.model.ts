import * as mongoose from 'mongoose';
let Schema = mongoose.Types,
  ObjectId = Schema.ObjectId;

export const catalogueSchema = new mongoose.Schema(
  {
    productId: {
      type: ObjectId,
      $ref: 'products',
    },
    storeId: {
      type: ObjectId,
      $ref: 'userdatas',
    },
    catalogueStatus: {
      type: Boolean,
    },
    variants: {
      type: ObjectId,
      $ref: 'metadatas',
    },
  },
  { timestamps: true },
);

export interface catalogue extends mongoose.Document {
  _id: mongoose.ObjectId;
  productId: mongoose.ObjectId;
  storeId: mongoose.ObjectId;
  catalogueStatus: Boolean;
  variants: mongoose.ObjectId;
  updatedAt: Date;
  createdAt: Date;
}
