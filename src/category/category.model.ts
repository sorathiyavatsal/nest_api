import * as mongoose from 'mongoose';
let ObjectId = mongoose.Types.ObjectId;
export const CategorySchema = new mongoose.Schema(
    {
        categoryName: {
            type: String,
            required: true,
        },
        categoryPic: {
            type: String
        },
        categoryType: {
            type: String
        },
        description: {
            type: String
        },
        parent: {
            type: ObjectId,
            ref: 'Category',
        },
        status: {
            type: Boolean,
        },
    },
    { timestamps: true },
);

export interface Category extends mongoose.Document {
    _id: string;
    categoryName: string,
    categoryPic: string,
    categoryType: string,
    description: string,
    parent: string,
    status: Boolean,
}
