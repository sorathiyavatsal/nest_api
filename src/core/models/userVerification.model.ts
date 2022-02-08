import * as mongoose from 'mongoose';
import * as bcrypt from 'bcrypt';
let Schema = mongoose.Types,
 ObjectId = Schema.ObjectId;
export const UserVerificationSchema = new mongoose.Schema({
    verificationType: {
        type: String,
        default: 'email',
        required: true
    },
    otp: {
        type: String,
        required: true
    },
    verifiedTemplate: {
        type: String
    },
    verifiedStatus: {
        type: Boolean,
        default: false
    },
    deliveryId:
    {
        type: ObjectId,
        ref: 'Deliveryfleets'
    },
    createdBy: {
        type: ObjectId,
        ref: 'Users'
    },
    verifiedTime:{
    type:Date
    
    },
    createdUser:
    {
        type: ObjectId,
        ref: 'Users'
    },
    modifiedBy: {
        type: ObjectId,
        ref: 'Users'
    }
   

}, { timestamps: true });
UserVerificationSchema.index({ content: "text" });
export interface UserVerification extends mongoose.Document {
    _id: string;
    verificationType: string;
    otp: string,
    verifiedTemplate:string,
    verifiedStatus:boolean,
    verifiedTime:Date,
    createdUser:string,
    createdAt:Date,
    createdBy:string,
    modifiedBy:string,
    activeStatus:boolean
    
}
