import * as mongoose from 'mongoose';
import * as bcrypt from 'bcrypt';
let Schema = mongoose.Schema,
 ObjectId = Schema.ObjectId;
export const  CategorySchema = new mongoose.Schema({
   
    image: {
        type: Object,
      
    },
    svgImage:
    {
        type:String
    },
    name: {
        type: String,
        unique: true,
        required: true
    },
    rate: {
        type: Number,
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

export interface Category extends mongoose.Document {
    _id: string;
    name: string;
    rate: number;
    image:object,
    svgImage:string,
    activeStatus:boolean
    updatedAt:Date,
    createdAt:Date,
    createdBy:string,
    modifiedBy:string
    
    
}
