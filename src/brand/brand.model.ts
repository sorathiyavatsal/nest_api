import * as mongoose from 'mongoose';
let ObjectId = mongoose.Types.ObjectId;
export const BrandsSchema = new mongoose.Schema(
    {
        brandName: {
            type: String,
            required: true,
        },
        brandPic: {
            type: String
        },
        description: {
            type: String
        },
        status: {
            type: Boolean,
        },
    },
    { timestamps: true },
);

export interface Brands extends mongoose.Document {
    _id: string;
    brandName: string,
    brandPic: string,
    description: string,
    status: Boolean,
}
