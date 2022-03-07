import * as mongoose from 'mongoose';
let ObjectId = mongoose.Types.ObjectId;
export const EarningSchema = new mongoose.Schema({
    JobId: {
        type: ObjectId,
        $ref: 'deliveryfleets'
    },
    deliveryBoyId: {
        type: ObjectId,
        $ref: 'users'
    },
    workedHours: {
        type: String
    },
    travelledKMs: {
        type: String
    },
    amount: {
        type: String
    },
    startDateTime: {
        type: String
    },
    endDateTime: {
        type: String
    },
    settlmentId: {
        type: ObjectId,
        $ref: 'settlements'
    },
}, { timestamps: true });

export interface Earning extends mongoose.Document {
  _id: string;
  JobId: mongoose.ObjectId;
  deliveryBoyId: mongoose.ObjectId;
  workedHours: number;
  travelledKMs: number;
  amount: number;
  startDateTime: string;
  endDateTime: string;
  settlmentId: mongoose.ObjectId;
}
