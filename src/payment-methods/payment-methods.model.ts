import * as mongoose from 'mongoose';
let ObjectId = mongoose.Types.ObjectId;
export const PaymentMethodsSchema = new mongoose.Schema(
    {
        razorpay_payment_id: {
            type: String,
        },
        razorpay_order_id: {
            type: String,
        },
        razorpay_signature: {
            type: String,
        }
    },
    { timestamps: true },
);

export interface PaymentMethods extends mongoose.Document {
    _id: string;
    razorpay_payment_id: string;
    razorpay_order_id: string;
    razorpay_signature: string;
}