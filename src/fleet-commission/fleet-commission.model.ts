import * as mongoose from 'mongoose';
let Schema = mongoose.Types,
  ObjectId = Schema.ObjectId;
export const FleetCommissionSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    wages: {
      hoursPerMonth: { type: Number, required: true },
      dayPerMonth: { type: Number, required: true },
      amount: { type: Number, required: true },
    },
    fuel: {
      price: { type: Number, required: true },
      kmPerMOnth: { type: Number, required: true },
    },
    additionalPerKm: { type: Number, default: 0 },
    additionalPerHour: { type: Number, default: 0 },
    incentive: {
      isPercantage: { type: Boolean, default: true },
      value: { type: Number, required: true },
    },
    surcharge: {
      isPercantage: { type: Boolean, default: true },
      value: { type: Number, required: true },
    },
    fix: { type: Number },
    isRegional: { type: Boolean, default: false },
    zipcodes: [{ type: String }],
  },
  { timestamps: true },
);

export interface FleetCommission extends mongoose.Document {
  _id: string;
  name: string;
  wages: {
    hoursPerMonth: number;
    dayPerMonth: number;
    amount: number;
  };
  fuel: {
    price: number;
    kmPerMOnth: number;
  };
  additionalPerKm: number;
  additionalPerHour: number;
  incentive: {
    isPercantage: Boolean;
    value: number;
  };
  surcharge: {
    isPercantage: Boolean;
    value: number;
  };
  fix: number;
  isRegional: Boolean;
  zipcodes: [string];
}
