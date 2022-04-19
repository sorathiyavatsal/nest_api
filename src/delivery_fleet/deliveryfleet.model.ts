import * as mongoose from 'mongoose';
let ObjectId = mongoose.Types.ObjectId;
export const DeliveryFleetSchema = new mongoose.Schema(
  {
    fromName: {
      type: String,
      required: true,
    },
    fromLandMark: {
      type: String,
    },
    fromAddress: {
      type: String,
      required: true,
    },
    fromZipcode: {
      type: String,
      required: true,
    },
    fromLat: {
      type: String,
      required: true,
    },
    fromLng: {
      type: String,
      required: true,
    },
    fromPhone: {
      type: String,
      required: true,
    },
    toName: {
      type: String,
      required: true,
    },
    toLandMark: {
      type: String,
    },
    toAddress: {
      type: String,
      required: true,
    },
    toZipcode: {
      type: String,
      required: true,
    },
    toLat: {
      type: String,
      required: true,
    },
    toLng: {
      type: String,
      required: true,
    },
    toPhone: {
      type: String,
      required: true,
    },
    fromLoc: {
      type: {
        type: String,
        enum: ['Point'],
      },
      coordinates: {
        type: [Number],
      },
    },
    toLoc: {
      type: {
        type: String,
        enum: ['Point'],
      },
      coordinates: {
        type: [Number],
      },
    },
    goods: {
      type: ObjectId,
      required: true,
    },
    numberofPack: {
      type: String,
      required: true,
    },
    weightPack: {
      type: String,
      required: true,
    },
    pickupType: {
      type: String,
      required: true,
    },
    pickupDate: {
      type: Date,

      required: true,
    },
    pickupTime: {
      type: String,
      required: false,
    },
    cor: {
      type: Number,
    },
    deliverChargeType: {
      type: String,
      enum: ['1', '2', '3'],
    },
    invoiceStatus: {
      type: String,
      enum: [
        'progress',
        'pending',
        'complete',
        'dispatched',
        'delivered',
        'cancelled',
        'faliure',
        'accepted',
        'pickup',
      ],
      default: 'pending',
    },

    goodsPhotos: {
      type: Object,
      default: [],
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
    deliveryBoy: {
      type: ObjectId,
      ref: 'Users',
    },
    totalHrs: {
      type: Number,
    },
    distance: {
      type: Number,
      default: 1,
    },
    price: {
      type: Number,
      default: 10,
    },
    activeStatus: {
      type: Boolean,
      default: false,
    },
    userId: {
      type: ObjectId,
      ref: 'Users',
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
DeliveryFleetSchema.index({ loc: '2dsphere' });
DeliveryFleetSchema.index({ fromLoc: '2dsphere' });
DeliveryFleetSchema.index({ toLoc: '2dsphere' });
export interface DeliveryFleet extends mongoose.Document {
  _id: string;
  fromName: string;
  fromLandMark: string;
  fromAddress: string;
  fromZipcode: string;
  fromLat: string;
  fromLng: string;
  fromPhone: string;
  toAddress: string;
  toZipcode: string;
  toName: string;
  toLandMark: string;
  fromLoc: object;
  toLoc: object;
  toLat: string;
  toLng: boolean;
  toPhone: string;
  loc: any;
  goodsPhotos: object;
  goods: string;
  numberofPack: number;
  weightPack: string;
  pickupType: string;
  pickupDate: Date;
  pickupTime: Date;
  distance: number;
  userId: string;
  cor: number;
  deliverChargeType: string;
  invoiceStatus: string;
  activeStatus: Boolean;
  deliveryBoy: mongoose.ObjectId;
  updatedAt: Date;
  createdAt: Date;
  totalHrs: string;
  createdBy: string;
  modifiedBy: string;
}
