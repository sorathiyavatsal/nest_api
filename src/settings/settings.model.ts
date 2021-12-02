import * as mongoose from 'mongoose';
import * as bcrypt from 'bcrypt';
let Schema = mongoose.Schema,
 ObjectId = Schema.ObjectId;
export const SettingsSchema = new mongoose.Schema({
    column_key: {
        type: String,
        required: true,
        unique:true
    },
    column_value: {
        type: String,
        required: true
    },
    
    
}, { timestamps: true });

export interface Settings extends mongoose.Document {
    _id: string;
    column_key: string,
    column_value:string;
    updatedAt:Date,
    createdAt:Date,
    
    
}
