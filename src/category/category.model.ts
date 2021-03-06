import * as mongoose from 'mongoose';
let ObjectId = mongoose.Types.ObjectId;
export const CategoriesSchema = new mongoose.Schema(
    {
        categoryName: {
            type: String,
        },
        categoryImage: {
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
            required: false
        },
        status: {
            type: Boolean,
        },
    },
    { timestamps: true },
);

export interface Categories extends mongoose.Document {
    _id: string;
    categoryName: string,
    categoryImage: string,
    categoryType: string,
    description: string,
    parent: string,
    status: Boolean,
}
