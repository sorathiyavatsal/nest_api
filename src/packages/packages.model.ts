import * as mongoose from 'mongoose';
import * as bcrypt from 'bcrypt';
let Schema = mongoose.Schema,
 ObjectId = Schema.ObjectId;
export PackagesSchema = new mongoose.Schema({
    1: {
        type: String,
        required: false
    },
    2: {
        type: String,
        required: false
    },
    3: {
        type: String,
        required: false
    },
    4: {
        type: String,
        required: false
    },
    5: {
        type: String,
        required: false
    },
    greatethen_5: {
        type: String,
        required: false
    },
    greaterthanorequalto_10: {
        type: String,
        required: false
    },
    
}, { timestamps: true });

export interface Security extends mongoose.Document {
    _id: string;
    1: string,
    2:string;
    3:string,
    4:string,
    5:string,
    greatethen_5:string,
    greaterthanorequalto_10:string,
    updatedAt:Date,
    createdAt:Date,
    
    
}
