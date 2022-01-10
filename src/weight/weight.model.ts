import * as mongoose from 'mongoose';
import * as bcrypt from 'bcrypt';
let Schema = mongoose.Schema,
 ObjectId = Schema.ObjectId;

export const WeightsSchema = new mongoose.Schema(
         {
           category: {
             type: ObjectId,
             required: true,
             ref: 'Category',
           },
           from_weight: {
             type: Number,
             required: false,
           },
           to_weight: {
             type: Number,
             required: false,
           },

           rate: {
             type: Number,
             required: false,
           },
           activeStatus: {
             type: Boolean,
             default: true,
           },
           createdBy: {
             type: ObjectId,
             ref: 'Users',
           },
           modifiedBy: {
             type: ObjectId,
             ref: 'Users',
           },
         },
         { timestamps: true },
       );

export interface Weights extends mongoose.Document {
    _id: string;
    category: string,
    from_weight:number;
    to_weight:number,
    rate:number,
    activeStatus:boolean
    updatedAt:Date,
    createdAt:Date,
    createdBy:string,
    modifiedBy:string
    
    
    
}
