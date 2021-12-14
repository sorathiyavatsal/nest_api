import { Holidays } from '../holiday/holiday.model';
import { Injectable, BadRequestException} from '@nestjs/common';
import { DeliveryFleet } from './deliveryfleet.model';
import { Weights } from '../weight/weight.model';
import { Category } from '../category/category.model';
import { Packages } from '../packages/packages.model';
import { Packagings } from '../packaging/packaging.model';
import { Settings } from '../settings/settings.model';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateDeliveryFleetDto } from './dto/create-deliveryfleet';
import { EditDeliveryFleetDto } from './dto/edit-deliveryfleet';
import { v5 as uuidv5 } from 'uuid';
import { DeliveryChargesDto } from './dto/deliverycharges';
import { Buffer } from 'buffer'
import { SendEmailMiddleware } from '../core/middleware/send-email.middleware';
import { throws } from 'assert';
import {User} from "../auth/user.model";
const GeoPoint = require('geopoint');
@Injectable()
export class DeliveryFleetService {
    constructor(
     @InjectModel('DeliveryFleet') private deliveryfleetModel: Model<DeliveryFleet>,
     @InjectModel('Weights') private WeightsModel: Model<Weights>,
     @InjectModel('Category') private CategoryModel: Model<Category>,
     @InjectModel('Packages') private PackagesModel: Model<Packages>,
     @InjectModel('Packagings') private PackagingsModel: Model<Packagings>,
     @InjectModel('Holidays') private holidaysModel: Model<Holidays>,
     @InjectModel('Settings') private SettingsModel: Model<Settings>,
     @InjectModel('User') private UserModel: Model<User>,
       ){
   
       }
    async  createnewDeliveryFleet(files:any,req:any)
    {
        let  today = new Date();
        today.setHours(23);
        today.setMinutes(59);
        today.setSeconds(59);
        let holidays=await this.holidaysModel.find({ $or:[
            {fromDate:{$gte:new Date(req.body.pickupDate),$lt:new Date(req.body.pickupDate)}},
            {fromDate:{$gte:new Date(req.body.pickupDate),$lt:new Date(today)}}
        
            ]})
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
       
        const invoiceData = new this.deliveryfleetModel(dto)
        
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
    async getDeliveyDistance(order:any)
    {
        let point1 = new GeoPoint(order.fromLat, order.fromLng);
        let point2 = new GeoPoint(order.toLat, order.toLng);
        let distance = point1.distanceTo(point2, true)//output in kilometers
        return distance;
    }
    async updateLocationDeliveryFleet(id:any,dto:any,req:any)
    {
        let  today = new Date();
        today.setHours(23);
        today.setMinutes(59);
        today.setSeconds(59);
        let holidays=await this.holidaysModel.find({ $or:[
            {fromDate:{$gte:new Date(req.body.pickupDate),$lt:new Date(req.body.pickupDate)}},
            {fromDate:{$gte:new Date(req.body.pickupDate),$lt:new Date(today)}}
        
            ]})
        if(holidays.length>0)
        {
            return new BadRequestException(req.body.pickupDate+" is holiday");
        }
        
        let userid:string;
        if(req.user && req.user.user._id)
        {
            userid=req.user.user._id;
            dto.createdBy =  userid;
            dto.modifiedBy = userid;
        }
        if(dto.loc && dto.loc.type!="Point")
        {
          
          delete dto.loc
        }
        await this.deliveryfleetModel.update({_id:id},{$set:dto});
        return this.deliveryfleetModel.findOne({_id:id}).then((data:any)=>{
            return data.toObject({ versionKey: false });
        },error=>{
            return new BadRequestException("Invalid Invoice");
        })
    }
    async updateDeliveryFleetPayment(id:any,dto:any,req:any)
    {
        let deliveryBoy:any=await this.UserModel.findOne({role:"DELIVERY",activeStatus:true})
        return this.deliveryfleetModel.findOne({_id:id}).then((data:any)=>{
          data.deliverChargeType=dto.deliverChargeType;
          data.save();
          return {deliveryFleet:data,deliveryBoy:deliveryBoy}
        },error=>{
            return new BadRequestException("Invalid Invoice");
        })
       
    }
    async updateDeliveryStatus(id:any,dto:any,req:any)
    {
       return this.deliveryfleetModel.findOne({_id:id}).then((data:any)=>{
          data.invoiceStatus=dto.invoiceStatus;
          data.save();
          return data.toObject({ versionKey: false });
        },error=>{
            return new BadRequestException("Invalid Invoice");
        })
       
    }
    async updateDeliveryFleet(id:any,files:any,req:any)
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
        await this.deliveryfleetModel.update({_id:id},{$set:dto});
        return this.deliveryfleetModel.findOne({_id:id}).then((data:any)=>{
          return data.toObject({ versionKey: false });
        },error=>{
            return new BadRequestException("Invalid Invoice");
        })
       
    }


    async getDeliveryFleet(user:any)
    {
        let where:any={}
        if(user.role=="merchant")
         where.createdBy=user._id;
        return this.deliveryfleetModel.find(where);
    }


    async getDeliveryFleetData(id:any,req:any)
    {
        let invoice:any=await this.deliveryfleetModel.findOne({_id:id});
        return invoice.toObject({ versionKey: false });
    }
   
    async getDeliveryCharges( Dto: DeliveryChargesDto){
       
        let dto_category = Dto.category
        let dto_weight = Dto.weight
        let dto_packages = Dto.packages
        let distenance = Dto.distenance;
        let weather = Dto.weather;
        let traffic = Dto.traffic;
        
        var weight_price=15;
        var packages_price=15;
        var packaging_price=15;
        let weather_price=12;
        let traffic_price=0;
        
        let settings = await this.SettingsModel.find({});
        let category  = await this.CategoryModel.findOne({_id:dto_category});

        //weight
        let weight  = await this.WeightsModel.findOne({category:dto_category,from_weight:{$gte:dto_weight},to_weight:{$lte:dto_weight}})
        if(weight && weight_price){
             weight_price= weight.rate;
        }

       //packages
        let packages  = await this.PackagesModel.findOne({category:dto_category,from_pack:{$gte:dto_packages},to_pack:{$lte:dto_packages}})
        if(packages && packages_price) packages_price= packages.rate;                          
        
        //packaging
        let packaging  = await this.PackagingsModel.findOne({category:dto_category});
        if(packaging) packaging_price= packaging.rate;



        return weight_price+packages_price+packaging_price+weather_price+traffic_price;


        /*
        var packager_amount = 0 ;
        var  weight_amount = 15;
        var  packaging_amount = 0;
        var  distance_amount = 0;
        
        
//packages amount
        if(category == 1){
            if(packages == 1){
                packager_amount = 0
            }

            else if(packages == 2){
                packager_amount = 0.25
            }

            else if(packages == 3){
                packager_amount = 0.25
            }

            else if(packages == 4){
                packager_amount = 0.25
            }

            else if(packages == 5){
                packager_amount = 0.25
            }

            else if(packages >= 5){
                packager_amount = 0.50
            }

            else if(packages <= 10){
                packager_amount = 0.50
            }  
        }

        else if(category == 2){
            if(packages == 1){
                packager_amount = 0
            }

            else if(packages == 2){
                packager_amount = 1
            }

            else if(packages == 3){
                packager_amount = 1
            }

            else if(packages == 4){
                packager_amount = 1
            }

            else if(packages == 5){
                packager_amount = 1
            }

            else if(packages >= 5){
                packager_amount = 2
            }

            else if(packages <= 10){
                packager_amount = 2
            }
        }

        else if(category == 3){
            if(packages == 1){
                packager_amount = 0
            }

            else if(packages == 2){
                packager_amount = 1
            }

            else if(packages == 3){
                packager_amount = 1
            }

            else if(packages == 4){
                packager_amount = 1
            }

            else if(packages == 5){
                packager_amount = 1
            }

            else if(packages >= 5){
                packager_amount = 2
            }

            else if(packages <= 10){
                packager_amount = 2
            }
        }

        else if(category == 4){
            if(packages == 1){
                packager_amount = 0
            }

            else if(packages == 2){
                packager_amount = 1.50
            }

            else if(packages == 3){
                packager_amount = 1.50
            }

            else if(packages == 4){
                packager_amount = 1.50
            }

            else if(packages == 5){
                packager_amount = 1.50
            }

            else if(packages >= 5){
                packager_amount = 3
            }

            else if(packages <= 10){
                packager_amount = 3
            }
        }

        else if(category == 5){
            if(packages == 1){
                packager_amount = 0
            }

            else if(packages == 2){
                packager_amount = 5
            }

            else if(packages == 3){
                packager_amount = 5
            }

            else if(packages == 4){
                packager_amount = 5
            }

            else if(packages == 5){
                packager_amount = 5
            }

            else if(packages >= 5){
                packager_amount = 10
            }

            else if(packages <= 10){
                packager_amount = 10
            }
        }

        else if(category == 6){
            if(packages == 1){
                packager_amount = 0
            }

            else if(packages == 2){
                packager_amount = 0.50
            }

            else if(packages == 3){
                packager_amount = 0.50
            }

            else if(packages == 4){
                packager_amount = 0.50
            }

            else if(packages == 5){
                packager_amount = 0.50
            }

            else if(packages >= 5){
                packager_amount = 1
            }

            else if(packages <= 10){
                packager_amount = 1
            }
        }

        else if(category == 7){
            if(packages == 1){
                packager_amount = 0
            }

            else if(packages == 2){
                packager_amount = 1.50
            }

            else if(packages == 3){
                packager_amount = 1.50
            }

            else if(packages == 4){
                packager_amount = 1.50
            }

            else if(packages == 5){
                packager_amount = 1.50
            }

            else if(packages >= 5){
                packager_amount = 3
            }

            else if(packages <= 10){
                packager_amount = 3
            }
        }
        
        //weight amount

        if(category == 1){
            if(weight <= 1){
                weight_amount = 15
            }

            else if(weight > 1 && weight <=2){
                 weight_amount = 15 + 0.50
            }

            else if(weight > 2 && weight <=3){
                weight_amount = 15 + 0.50
            }

            else if(weight > 3 && weight <=5){
                 weight_amount = 15 + 0.50
            }

            else if(weight >= 5 ){
                 weight_amount = 15 + 1
            }

            else if(weight <= 10 ){
                 weight_amount = 15 + 1
            }
            
        }

        else if(category == 2){

            if(weight <= 1){
                 weight_amount = 15
            }

            else if(weight > 1 && weight <=2){
                 weight_amount = 15 + 1
            }

            else if(weight > 2 && weight <=3){
                 weight_amount = 15 + 1
            }

            else if(weight > 3 && weight <=5){
                 weight_amount = 15 +1
            }

            else if(weight >= 5 ){
                 weight_amount = 15 + 2
            }

            else if(weight <= 10 ){
                 weight_amount = 15 + 2
            }
        }

        else if(category == 3){
            
            if(weight <= 1){
                 weight_amount = 15
            }

            else if(weight > 1 && weight <=2){
                 weight_amount = 15 + 2
            }

            else if(weight > 2 && weight <=3){
                 weight_amount = 15 + 2
            }

            else if(weight > 3 && weight <=5){
                 weight_amount = 15 + 2
            }

            else if(weight >= 5 ){
                 weight_amount = 15 + 3
            }

            else if(weight <= 10 ){
                 weight_amount = 15 + 3
            }
        }

        else if(category == 4){

            if(weight <= 1){
                 weight_amount = 15
            }

            else if(weight > 1 && weight <=2){
                 weight_amount = 15 + 2
            }

            else if(weight > 2 && weight <=3){
                 weight_amount = 15 + 2
            }

            else if(weight > 3 && weight <=5){
                 weight_amount = 15 + 2
            }

            else if(weight >= 5 ){
                 weight_amount = 15 + 3
            }

            else if(weight <= 10 ){
                 weight_amount = 15 + 3
            }
        }

        else if(category == 5){
            
            if(weight <= 1){
                 weight_amount = 15
            }

            else if(weight > 1 && weight <=2){
                 weight_amount = 15 + 10
            }

            else if(weight > 2 && weight <=3){
                 weight_amount = 15 + 10
            }

            else if(weight > 3 && weight <=5){
                 weight_amount = 15 + 10
            }

            else if(weight >= 5 ){
                 weight_amount = 15 + 20
            }

            else if(weight <= 10 ){
                 weight_amount = 15 + 20
            }
        }

        else if(category == 6){
            
            if(weight<= 1){
                 weight_amount = 15
            }

            else if(weight > 1 && weight <=2){
                 weight_amount = 15 + 1
            }

            else if(weight > 2 && weight <=3){
                 weight_amount = 15 + 1
            }

            else if(weight > 3 && weight <=5){
                 weight_amount = 15 + 1
            }

            else if(weight >= 5 ){
                 weight_amount = 15 + 2
            }

            else if(weight <= 10 ){
                weight_amount = 15 + 2
            }
        }

        else if(category == 7){
            
            if(weight <= 1){
                 weight_amount = 15
            }

            else if(weight > 1 && weight <=2){
                 weight_amount = 15 + 2
            }

            else if(weight > 2 && weight <=3){
                 weight_amount = 15 + 2
            }

            else if(weight > 3 && weight <=5){
                 weight_amount = 15 + 2
            }

            else if(weight >= 5 ){
                 weight_amount = 15 + 3
            }

            else if(weight <= 10 ){
                 weight_amount = 15 + 3
            }
        }

        //packaging amount

        if(category == 1){
            packaging_amount = 3  
        }

        else if(category == 2){
            packaging_amount = 7.50 
        }

        else if(category == 3){
            packaging_amount = 10
        }

        else if(category == 4){
            packaging_amount = 10
        }

        else if(category == 5){
            packaging_amount = 10
        }

        else if(category == 6){
            packaging_amount = 10
        }

        else if(category == 7){
            packaging_amount = 10
        }

        let total_amount = packager_amount + weight_amount + packaging_amount ;

        let delivery_fleet = {'packages_amount':packager_amount,'weight_amount':weight_amount,'packaging_amount':packaging_amount,'total_fee':total_amount};
        let input_datas = {'category':category,'weight':weight,'packages':packages};
        return {input_datas,delivery_fleet};
*/
   
    }
}
