import { Injectable, BadRequestException} from '@nestjs/common';
import { Invoice } from './invoice.model';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateInvoiceDto } from './dto/create-invoice';
import { v5 as uuidv5 } from 'uuid';
import { Buffer } from 'buffer'
import { SendEmailMiddleware } from './../core/middleware/send-email.middleware';
import { throws } from 'assert';

@Injectable()
export class InvoiceService {
    constructor(
     @InjectModel('Invoice') private invoiceModel: Model<Invoice>
       ){
   
       }
    async  createnewInvoice(files:any,req:any)
    {
        
        let dto =req.body;
        let userid:string;
        if(req.user && req.user.user._id)
        {
            userid=req.user.user._id;
            dto.createdBy =  userid;
            dto.modifiedBy = userid;
        }
        if(files && files.length>0)
        {
            dto.goodsPhotos = files;
        }
        const invoiceData = new this.invoiceModel(dto)
        return await invoiceData.save().then((newInvoice:any) => {
        if(!newInvoice)
        {
            return new BadRequestException("Invalid Invoice");
        }
        else if(newInvoice && newInvoice.createdBy && newInvoice.createdBy!='')
        {
            return {invoice:newInvoice,redirect:false};
        }
        else
        {
            return {invoice:newInvoice,redirect:true};
        }
    });
    }
    async updateInvoice(id:any,files:any,req:any)
    {
        let dto =req.body;
        let userid:string;
        if(req.user && req.user.user._id)
        {
            userid=req.user.user._id;
            dto.createdBy =  userid;
            dto.modifiedBy = userid;
        }
        if(files && files.length>0)
        {
            dto.goodsPhotos = files;
        }
        let invoice:any=await this.invoiceModel.findOne({_id:id});
        if(!invoice)
        {
        return new BadRequestException("Invalid Invoice");
        }
        dto._id=id;
        invoice = dto;
        let invoiceUpdate:any=await invoice.save();
        if(!invoiceUpdate)
        {
        return new BadRequestException("Unable update  Invoice");
        }
        else
        {
         return invoiceUpdate.toObject({ versionKey: false });
        }
    }
    async getInvoices(req:any)
    {
        return this.invoiceModel.find();
    }
    async getInvoiceData(id:any,req:any)
    {
        let invoice:any=await this.invoiceModel.findOne({_id:id});
        return invoice.toObject({ versionKey: false });
    }
}
