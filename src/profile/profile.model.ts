import * as mongoose from 'mongoose';
import * as bcrypt from 'bcrypt';
import { type } from 'os';
let Schema = mongoose.Schema,
 ObjectId = Schema.ObjectId;
export const ProfileSchema = new mongoose.Schema({
    profile_photo: {
        type: Object,
        
    },
    userId:{
        type:ObjectId,
        required:true,
        unique:true
    },
    gender: {
        type: String,
        enum : ['Male','Female','Others'],
        
    },
    dob: {
        type: Date,
        required: false
    },
    shop_name: {
        type: String,
        required: false
    },
    shop_address: {
        type:String,
        required: false
    },
    sell_items: {
        type: String,
        enum : ['grocery','books','foods','elecronics'],
    },

    adharcard_no: {
        type:Object,
    },

    pancard_no: {
        type:Object,
    },

    gst_no: {
        type:Object,
    },

    bank_details :[{
        
            bank_account_no: {type: Number,required: false},

            bank_account_holer_name: {type: String,required: false},
            
            bank_name: {type: String,required: false},

            ifsc_code: {type: String,required: false}
        }],

    

    createdBy: {
        type: ObjectId,
        ref: 'Users'
    },
    modifiedBy: {
        type: ObjectId,
        ref: 'Users'
    }
    
    
}, { timestamps: true });

export interface Profile extends mongoose.Document {
    _id: string;
    profile_photo: object,
    gender: string,
    dob: Date,
    shop_name: string,
    shop_address: string,
    sell_items: string,
    adharcard_no: string,
    pancard_no: string,
    gst_no: string,
    bank_details:object,
    activeStatus:boolean,
    updatedAt:Date,
    createdAt:Date,
    createdBy:string,
    modifiedBy:string
    
    
}
