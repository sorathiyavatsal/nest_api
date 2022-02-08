import * as mongoose from 'mongoose';
import * as bcrypt from 'bcrypt';
let Schema = mongoose.Types,
 ObjectId = Schema.ObjectId;
export const HolidaysSchema = new mongoose.Schema({
    name: {
        type: String,
        required: false
    },
    fromDate: {
        type: String,
        required: false
    },
    toDate: {
        type: String,
        required: false
    },
    activeStatus:
    {
        type:Boolean,
        default:true
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

export interface Holidays extends mongoose.Document {
    _id: string;
    name: string,
    fromDate:string;
    toDate:string,
    activeStatus:boolean
    updatedAt:Date,
    createdAt:Date,
    createdBy:string,
    modifiedBy:string
    
    
}
