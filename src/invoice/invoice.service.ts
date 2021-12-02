import { Holidays } from './../holiday/holiday.model';
import { Injectable, BadRequestException} from '@nestjs/common';
import { Invoice } from './invoice.model';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateInvoiceDto } from './dto/create-invoice';
import { v5 as uuidv5 } from 'uuid';
import { Buffer } from 'buffer'
import { SendEmailMiddleware } from './../core/middleware/send-email.middleware';
import { throws } from 'assert';

const GeoPoint = require('geopoint');
@Injectable()
export class InvoiceService {
    constructor(
     @InjectModel('Invoice') private invoiceModel: Model<Invoice>,
     @InjectModel('Holidays') private holidaysModel: Model<Holidays>
       ){
   
       }
    async  createnewInvoice(files:any,req:any)
    {
        let  today = new Date();
        today.setHours(23);
        today.setMinutes(59);
        today.setSeconds(59);
        let holidays=await this.holidaysModel.find({ $or:[
            {fromDate:{$gte:new Date(req.body.pickupDate),$lt:new Date(req.body.pickupDate)}},
            {fromDate:{$gte:new Date(req.body.pickupDate),$lt:new Date(today)}}
        
            ]})
        console.log(holidays)
        if(holidays.length>0)
        {
            return new BadRequestException(req.body.pickupDate+" is holiday");
        }
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
        if(dto.loc && dto.loc.type!="Point")
        {
          
        delete req.body.loc
        }
       
        const invoiceData = new this.invoiceModel(dto)
        
        return await invoiceData.save().then((newInvoice:any) => {
        if(!newInvoice)
        {
            return new BadRequestException("Invalid Invoice");
        }
        
        else if(newInvoice && newInvoice.createdBy && newInvoice.createdBy!='')
        {
            this.getDeliveyPrice(newInvoice);
            return {invoice:newInvoice,redirect:false};
        }
        else
        {
            this.getDeliveyPrice(newInvoice);
            return {invoice:newInvoice,redirect:true};
        }
    });
    }
    async getDeliveyPrice(order:any)
    {
        let point1 = new GeoPoint(order.fromLat, order.fromLng);
        let point2 = new GeoPoint(order.toLat, order.toLng);
        let distance = point1.distanceTo(point2, true)//output in kilometers
        order.distenance = distance;
        order.price = distance*15;
        this.invoiceModel.findAndModify({_id:order._id},order,function(err:any,doc:any) {
           return doc; 
        });
    }
    async updateLocationInvoice(id:any,files:any,req:any)
    {
        let  today = new Date();
        today.setHours(23);
        today.setMinutes(59);
        today.setSeconds(59);
        let holidays=await this.holidaysModel.find({ $or:[
            {fromDate:{$gte:new Date(req.body.pickupDate),$lt:new Date(req.body.pickupDate)}},
            {fromDate:{$gte:new Date(req.body.pickupDate),$lt:new Date(today)}}
        
            ]})
        console.log(holidays)
        if(holidays.length>0)
        {
            return new BadRequestException(req.body.pickupDate+" is holiday");
        }
        let dto =req.body;
        let userid:string;
        if(req.user && req.user.user._id)
        {
            userid=req.user.user._id;
            dto.createdBy =  userid;
            dto.modifiedBy = userid;
        }
        if(dto.loc && dto.loc.type!="Point")
        {
          
        delete req.body.loc
        }
        return this.invoiceModel.findOne({_id:id}).then((data:any)=>{
            if(dto.loc)
            data.loc = dto.loc
            data = dto;
            data.save();
            
            return data.toObject({ versionKey: false });
        },error=>{
            return new BadRequestException("Invalid Invoice");
        })
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
        if(dto.loc)
        {
          
        delete req.body.loc
        }
        return this.invoiceModel.findOne({_id:id}).then((data:any)=>{
            data = dto;
            data.save();
            this.getDeliveyPrice(data);
            return data.toObject({ versionKey: false });
        },error=>{
            return new BadRequestException("Invalid Invoice");
        })
       
        
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
