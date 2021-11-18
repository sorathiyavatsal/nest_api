import * as mongoose from 'mongoose';
import * as bcrypt from 'bcrypt';
let Schema = mongoose.Schema,
 ObjectId = Schema.ObjectId;
export const UserLoginSchema = new mongoose.Schema({
    browser: {
        type: String,
        
    },
    ipAddress: {
        type: String,
        
    },
    result:{
        type:Object
    },
    device: {
        type: Object,
       
    },
    redirectUrl: {
        type: String,
       
    },
    attemptStatus: {
        type: Boolean,
        default: false
    },
    attemptError: {
        type: String,
        default: ''
    },
    modifiedBy: {
        type: ObjectId,
        ref: 'Users'
    },
    createdBy: {
        type: ObjectId,
        ref: 'Users'
    },
    loginTime:{
    type:Date
    
    },
    userId:
    {
        type: ObjectId,
        ref: 'Users'
    },
    
   

}, { timestamps: true });
UserLoginSchema.index({ content: "text" });
export interface UserLogin extends mongoose.Document {
    _id: string;
    browser: string;
    device: [],
    ipAddress:string,
    result:[],
    redirectUrl:string,
    attemptError:string,
    attemptStatus:boolean,
    userId:string,
    createdAt:Date,
    createdBy:string,
    modifiedBy:string,
    updatedAt:Date,
    loginTime:Date
    
}
