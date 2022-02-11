import * as mongoose from 'mongoose';
import * as bcrypt from 'bcrypt';
let Schema = mongoose.Types,
  ObjectId = Schema.ObjectId;
export const DeliveryLocationSchema = new mongoose.Schema(
  {
    userId: {
      type: ObjectId,
      ref: 'Users',
    },
    deliveryId: {
      type: ObjectId,
      ref: 'Deliveryfleets',
    },
    modifiedBy: {
      type: ObjectId,
      ref: 'Users',
    },
    createdBy: {
      type: ObjectId,
      ref: 'Users',
    },

    loc: {
      type: {
        type: String,
        enum: ['Point'],
      },
      coordinates: {
        type: [Number],
      },
    },
  },
  { timestamps: true },
);
DeliveryLocationSchema.index({ loc: '2dsphere' });
export interface DeliveryLocation extends mongoose.Document {
  _id: string;
  deliveryId: string;
  userId: string;
  createdAt: Date;
  createdBy: string;
  modifiedBy: string;
  updatedAt: Date;
}
