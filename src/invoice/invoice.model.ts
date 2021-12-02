import * as mongoose from 'mongoose';
import * as bcrypt from 'bcrypt';
let Schema = mongoose.Schema,
 ObjectId = Schema.ObjectId;
export const InvoiceSchema = new mongoose.Schema({
    fromAddress: {
        type: String,
        required: true
    },
    fromZipcode: {
        type: String,
        required: true
    },
    fromLat: {
        type: String,
        required: true
    },
    fromLng: {
        type: String,
        required: true
    },
    fromPhone: {
        type: String,
        required: true
    },
    toAddress: {
        type: String,
        required: true
    },
    toZipcode: {
        type: String,
        required: true
    },
    toLat: {
        type: String,
        required: true
    },
    toLng: {
        type: String,
        required: true
    },
    toPhone: {
        type: String,
        required: true
    },
    goods: {
        type: String,
        required: true
    },
    numberofPack: {
        type: String,
        required: true
    },
    weightPack: {
        type: String,
        required: true
    },
    pickupType: {
        type: String,
        required: true
    },
    pickupDate: {
        type: Date,
       
        required: true
    },
    pickupTime: {
        type: Date,
        required: true
        
    },
    cor: {
        type: String
       
        
    },
    deliverChargeType: {
        type: Boolean,
        default: false
       
        
    },
    invoiceStatus: {
        type: String,
        enum : ['progress','pending','complete','dispatched','delivered','cancelled','faliure'],
        default: 'pending'
    },
   
    goodsPhotos:
    {
        type:Object,
        default:[]
    },
    loc:
    {
        type: {
            type: String, 
            enum: ['Point'], 
            
          },
          coordinates: {
            type: [Number],
            
          }
    },
    distenance:{
        type:Number,
        default:1
    },
    price:{
        type:Number,
        default:10
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

export interface Invoice extends mongoose.Document {
    _id: string;
    fromAddress: string;
    fromZipcode: string;
    fromLat: string,
    fromLng:string,
    fromPhone: string,
    toAddress: string;
    toZipcode: string;
    toLat: string,
    toLng:boolean,
    toPhone: string,
    loc:any,
    goodsPhotos:object,
    goods: string,
    numberofPack: number,
    weightPack: string,
    pickupType: string,
    pickupDate: Date,
    pickupTime: Date,
    distance:number,
    cor: string,
    deliverChargeType: Boolean,
    invoiceStatus: string,
    activeStatus: Boolean,
    updatedAt:Date,
    createdAt:Date,
    createdBy:string,
    modifiedBy:string
   
    
}
