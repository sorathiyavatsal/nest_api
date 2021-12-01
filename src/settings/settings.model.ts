import * as mongoose from 'mongoose';
import * as bcrypt from 'bcrypt';
let Schema = mongoose.Schema,
 ObjectId = Schema.ObjectId;
export SettingsSchema = new mongoose.Schema({
    column_key: {
        type: String,
        required: false
    },
    column_value: {
        type: String,
        required: false
    },
    
    
}, { timestamps: true });

export interface Settings extends mongoose.Document {
    _id: string;
   column_key: string,
    column_value:string;
    updatedAt:Date,
    createdAt:Date,
    
    
}
