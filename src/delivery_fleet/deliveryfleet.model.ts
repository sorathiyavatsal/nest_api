import * as mongoose from 'mongoose';
import * as bcrypt from 'bcrypt';
let Schema = mongoose.Schema,
 ObjectId = Schema.ObjectId;
export const DeliveryFleetSchema = new mongoose.Schema({
    fromName: {
        type: String,
        required: true
    },
    fromLandMark: {
        type: String
    },
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
    toName: {
        type: String,
        required: true
    },
    toLandMark: {
        type: String
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
    fromLoc:{
        type: {
            type: String, 
            enum: ['Point'], 
            
          },
          coordinates: {
            type: [Number],
            
          }
    },
    toLoc:{
        type: {
            type: String, 
            enum: ['Point'], 
            
          },
          coordinates: {
            type: [Number],
            
          }
    },
    goods: {
        type: ObjectId,
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
        type: String,
        enum : ['pay_now','pay_at_pickup','pay_from_drop_off'],
       
    },
    invoiceStatus: {
        type: String,
        enum : ['progress','pending','complete','dispatched','delivered','cancelled','faliure','accepted','pickup'],
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
    deliveryBoy:{
        type:ObjectId,
        ref:"Users"
    },
    distance:{
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
    userId: {
        type: ObjectId,
        ref: 'Users'
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
DeliveryFleetSchema.index({ loc: "2dsphere" });
DeliveryFleetSchema.index({ fromLoc: "2dsphere" });
DeliveryFleetSchema.index({ toLoc: "2dsphere" });
export interface DeliveryFleet extends mongoose.Document {
    _id: string;
    fromName: string;
    fromLandMark: string;
    fromAddress: string;
    fromZipcode: string;
    fromLat: string,
    fromLng:string,
    fromPhone: string,
    toAddress: string;
    toZipcode: string;
    toName: string;
    toLandMark: string;
    fromLoc: object;
    toLoc: object;
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
    userId: string,
    cor: string,
    deliverChargeType: string,
    invoiceStatus: string,
    activeStatus: Boolean,
    updatedAt:Date,
    createdAt:Date,
    createdBy:string,
    modifiedBy:string
   
    
}
