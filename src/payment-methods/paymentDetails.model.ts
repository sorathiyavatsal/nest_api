import * as mongoose from 'mongoose';
let ObjectId = mongoose.Types.ObjectId;
export const PaymentDetailsSchema = new mongoose.Schema(
    {
        userId: {
            type: ObjectId,
            $ref: 'users'
        },
        type: {
            type: 'string'
        },
        card: {
            type: Object,
        },
        netBanking: {
            type: String,
        },
        upi: {
            type: String,
        }
    },
    { timestamps: true },
);

export interface PaymentDetails extends mongoose.Document {
    _id: string;
    userId: mongoose.ObjectId;
    type: string;
    card: object;
    netBanking: string;
    upi: string;
}