import * as mongoose from 'mongoose';
import * as bcrypt from 'bcrypt';
let Schema = mongoose.Schema,
 ObjectId = Schema.ObjectId;
export WeightSchema = new mongoose.Schema({
    0_1: {
        type: String,
        required: false
    },
    1_2: {
        type: String,
        required: false
    },
    2_3: {
        type: String,
        required: false
    },
    3_5: {
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
    0_1: string,
    1_2:string;
    3_5:string,
    greatethen_5:string,
    greaterthanorequalto_10:string,
    updatedAt:Date,
    createdAt:Date,
    
    
}
