import * as mongoose from 'mongoose';
import * as bcrypt from 'bcrypt';
let Schema = mongoose.Schema,
 ObjectId = Schema.ObjectId;
export const SecuritySchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        unique: true,
        required: true
    },
    apiKey: {
        type: String
       
        
    },
    activeStatus: {
        type: Boolean,
        default: false
    },
    createdBy: {
        type: ObjectId,
        ref: 'Users'
    },
    modifiedBy: {
        type: ObjectId,
        ref: 'Users'
    }
   

}, { timestamps: true });

export interface Security extends mongoose.Document {
    _id: string;
    name: string;
    email: string;
    apiKey: string,
    activeStatus:boolean,
    updatedAt:Date,
    createdAt:Date,
    createdBy:string,
    modifiedBy:string
   
    
}
