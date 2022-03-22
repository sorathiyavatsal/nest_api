import * as mongoose from 'mongoose';

let Schema = mongoose.Types,
  ObjectId = Schema.ObjectId;

export const metaDataSchema = new mongoose.Schema(
  {
    productId: {
      type: ObjectId,
      $ref: ['products', 'catalogues'],
    },
    metaKey: {
      type: String,
    },
    metaValue: {
      type: [],
    },
    parentMetaId: {
      type: ObjectId,
      $ref: 'metadatas',
    },
    status: {
      type: Boolean,
    },
  },
  { timestamps: true },
);

export interface metaData extends mongoose.Document {
  _id: string;
  productId: mongoose.ObjectId;
  metaKey: string;
  metaValue: [];
  parentMetaId: mongoose.ObjectId;
  status: boolean;
}
