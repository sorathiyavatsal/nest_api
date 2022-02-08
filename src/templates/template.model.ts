import * as mongoose from 'mongoose';
import * as bcrypt from 'bcrypt';
let Schema = mongoose.Types,
 ObjectId = Schema.ObjectId;
export const TemplateSchema = new mongoose.Schema({
    name: {
        type: String,
        unique: true,
        required: true
    },
    content: {
        type: String,
        
    },
    filepath: {
        type: String,
        required: true
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
TemplateSchema.index({ content: "text" });
export interface Template extends mongoose.Document {
    _id: string;
    name: string;
    content: Buffer,
    updatedAt:Date,
    createdAt:Date,
    createdBy:string,
    modifiedBy:string,
    activeStatus:boolean
    
}
