import * as mongoose from 'mongoose';
import * as bcrypt from 'bcrypt';
let Schema = mongoose.Schema,
 ObjectId = Schema.ObjectId;
export CategorySchema = new mongoose.Schema({
    image: {
        type: String,
        required: true
    },
    name: {
        type: String,
        unique: true,
        required: true
    },
    
}, { timestamps: true });

export interface Category extends mongoose.Document {
    _id: string;
    name: string;
    image:string,
    updatedAt:Date,
    createdAt:Date,
    
    
}
