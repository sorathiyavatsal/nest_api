import * as mongoose from 'mongoose';
import * as bcrypt from 'bcrypt';
import { type } from 'os';
let Schema = mongoose.Schema,
 ObjectId = Schema.ObjectId;
export const ProfileDeliveryBoySchema = new mongoose.Schema({
    
    full_time:{ type: Boolean, default: false},

    part_time:{ type: Boolean, default: false},

    profile_photo: {
        type: Object,
        
    },
    gender: {
        type: String,
        enum : ['Male','Female','Others'],
        
    },
    dob: {
        type: Date,
        required: false
    },


    adharcard_no: {
        type: Object,
        
    },

    pancard_no: {
        type: Object,
    },

    driving_license_no: {
        type: Object,
    },

    vehicle : {type: String,
    enum : ['by_cycle','car','bus']
    },

    vehicle_rc_no: {
        type: Object,
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

export interface ProfileDeliveryBoy extends mongoose.Document {
    _id: string;
    full_time:boolean,
    paart_time:boolean,
    profile_photo: object,
    gender: string,
    dob: Date,
    adharcard_no: object,
    pancard_no: object,
    driving_license_no: object,
    vehicle:string,
    vehicle_rc_no:object,
    activeStatus:boolean,
    updatedAt:Date,
    createdAt:Date,
    createdBy:string,
    modifiedBy:string
    
    
}
