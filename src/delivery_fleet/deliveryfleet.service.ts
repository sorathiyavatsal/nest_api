import { Holidays } from '../holiday/holiday.model';
import { Injectable, BadRequestException } from '@nestjs/common';
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
import { User } from "../auth/user.model";
import { UserVerification } from 'src/core/models/userVerification.model';
import { DeliveryLocation } from './deliveryLocation.model';
import { identity } from 'rxjs';
const GeoPoint = require('geopoint');
let  ObjectId = require('mongodb').ObjectId;
@Injectable()
export class DeliveryFleetService {
    settings:any=[];
    constructor(
        private sendSms:SendEmailMiddleware,
        @InjectModel('UserVerification') private userVerificationModel: Model<UserVerification>,
        @InjectModel('DeliveryFleet') private deliveryfleetModel: Model<DeliveryFleet>,
        @InjectModel('Weights') private WeightsModel: Model<Weights>,
        @InjectModel('Category') private CategoryModel: Model<Category>,
        @InjectModel('Packages') private PackagesModel: Model<Packages>,
        @InjectModel('Packagings') private PackagingsModel: Model<Packagings>,
        @InjectModel('Holidays') private holidaysModel: Model<Holidays>,
        @InjectModel('Settings') private SettingsModel: Model<Settings>,
        @InjectModel('Users') private UserModel: Model<User>,
        @InjectModel('DeliveryLocation') private LocationModel :  Model<DeliveryLocation>
    ){
      
    }
    async createnewDeliveryFleet(files: any, req: any) {
        let today = new Date();
        today.setHours(23);
        today.setMinutes(59);
        today.setSeconds(59);
        let holidays = await this.holidaysModel.find({
            $or: [
                { fromDate: { $gte: new Date(req.body.pickupDate), $lt: new Date(req.body.pickupDate) } },
                { fromDate: { $gte: new Date(req.body.pickupDate), $lt: new Date(today) } }

            ]
        })
        if (holidays.length > 0) {
            return new BadRequestException(req.body.pickupDate + " is holiday");
        }
        let dto = req.body;
        let userid: string;
        if (req.user && req.user.user._id) {
            userid = req.user.user._id;
            dto.createdBy = userid;
            dto.modifiedBy = userid;
        }
        if (files && files.length > 0) {
            dto.goodsPhotos = files;
        }
        if (dto.loc && dto.loc.type != "Point") {

            delete req.body.loc
        }
        dto.toLoc=
        {
            type:"Point",
            coordinates:[dto.toLat,dto.toLng]
        }
        dto.FromLoc=
        {
            type:"Point",
            coordinates:[dto.fromLat,dto.fromLng]
        }
        const invoiceData = new this.deliveryfleetModel(dto)

        return await invoiceData.save().then((newInvoice: any) => {
            if (!newInvoice) {
                return new BadRequestException("Invalid Invoice");
            }

            else if (newInvoice && newInvoice.createdBy && newInvoice.createdBy != '') {

                return { invoice: newInvoice, redirect: false };
            }
            else {

                return { invoice: newInvoice, redirect: true };
            }
        });
    }
    async getDeliveyBoyNear(order: any) {
        
        let settings=await this.settingsData();
        let maxDis:any=10;
        let minDis:any=0;
       
        let max_dis_data:any=settings.find((s:any)=>(s.column_key=="max_distance_find"))
        if(max_dis_data)
        {
            maxDis = max_dis_data.column_value;
            
        }
        let min_dis_data:any=settings.find((s:any)=>(s.column_key=="min_distance_find"))
        if(min_dis_data)
        {
            minDis = min_dis_data.column_value;
            
        }
        let deliveryBoy: any = await this.UserModel.find(
            {role:'DELIVERY',
            loc:
            {
                $geoWithin: { 
                    $centerSphere: [ [ parseInt(order.fromLat) , parseInt(order.fromLng) ],maxDis/3959]
                    }
                
            }
        })
        return {boys:deliveryBoy,dto:order,max:maxDis};
    }
    async updateLocationDeliveryFleet(id: any, dto: any, req: any, user:any) {
        let today = new Date();
        today.setHours(23);
        today.setMinutes(59);
        today.setSeconds(59);
        let holidays = await this.holidaysModel.find({
            $or: [
                { fromDate: { $gte: new Date(req.body.pickupDate), $lt: new Date(req.body.pickupDate) } },
                { fromDate: { $gte: new Date(req.body.pickupDate), $lt: new Date(today) } }

            ]
        })
        if (holidays.length > 0) {
            return new BadRequestException(req.body.pickupDate + " is holiday");
        }

        let userid: string=user;
        dto.modifiedBy = userid;
       
        if (dto.loc && dto.loc.type != "Point") {

            delete dto.loc
            return new BadRequestException("Invalid Location");
        }
        else
        {
            await this.LocationModel.findOneAndUpdate({deliveryId:id,userId:user._id},{$set:dto.loc},{$upsert:true})
            await this.UserModel.findOneAndUpdate({_id:user._id},{$set:dto.loc},{$upsert:true})
        }
        await this.deliveryfleetModel.findOneAndUpdate({ _id: id }, { $set: dto }, {$upsert:true});
        return this.deliveryfleetModel.findOne({ _id: id }).then((data: any) => {
            return data.toObject({ versionKey: false });
        }, error => {
            return new BadRequestException("Invalid Location");
        })
    }
    async settingsData()
    {
     return this.SettingsModel.find({});
    }
    async findDeliveryBoy(id:string) {
        let delivery:any=this.deliveryfleetModel.findById(id);
        if(!delivery)
        {
            return new BadRequestException("Invalid Delivery Fleet");
        }
        let settings=await this.settingsData();
        let maxDis:any=4;
        let minDis:any=2;
        let max_dis_data:any=this.settings.find((s:any)=>(s.column_key=="max_distance_find"))
        if(max_dis_data)
        {
            maxDis = max_dis_data.column_value;
            if(parseInt(maxDis))
            maxDis=maxDis*1000;
        }
        let min_dis_data:any=this.settings.find((s:any)=>(s.column_key=="max_distance_find"))
        if(min_dis_data)
        {
            minDis = min_dis_data.column_value;
            if(parseInt(minDis))
            minDis=minDis*1000;
        }
        let deliveryBoy: any = await this.UserModel.find(
            { role: "DELIVERY", activeStatus: true, verifyStatus:true,
            loc:
            {
                $near: { 
                    $geometry: {
                        type: "Point" ,
                        coordinates: [ parseInt(delivery.fromLat) , parseInt(delivery.fromLng) ]
                    },
                    $maxDistance: maxDis
                }
            }
        })
        return deliveryBoy;
    }
    async updateDeliveryFleetBoy(id: any, req: any, user: any) {
        console.log(user)
        let delivery:any=await this.deliveryfleetModel.findOne({ _id: id }).populate("userId")
        if(!delivery)
        {
            return new BadRequestException("Invalid Delivery Fleet");
        }
        console.log(delivery)
        let dto=req.body;
        let updateObj:any={deliveryBoy:user.user._id,invoiceStatus:'accepted'};
        if(dto.loc && dto.loc.type=="Point")
        updateObj.loc=dto.loc;
        await this.deliveryfleetModel.findOneAndUpdate({_id:id},{$set:updateObj},{upsert: true});
        //let smsData:any=await this.loginVerificationSmsOtp(delivery.userId)
        let message:string='Byecom delivery accept your delivery  fleet order';
        this.sendSms.sensSMSdelivery(req,delivery.userId.phoneNumber,message)
        return {msg:'Trip is started successfully'}
        
    }
    async loginVerificationSmsOtp(userId,id:string,template:string='deliverystartsms') {
        await this.userVerificationModel.deleteMany({verificationType:template,deliverId:id})
        let verifiedTemplate = template;
        const newTokenVerifyEmail = new this.userVerificationModel({
          verificationType: 'sms',
          verifiedTemplate: verifiedTemplate,
          deliveryId:id,
          createdBy: userId,
          createdUser: userId,
          modifiedBy: userId,
          otp: Math.floor(1000 + Math.random() * 9000),
        });
        newTokenVerifyEmail.save();
        return newTokenVerifyEmail;
      }
    async updateDeliveryFleetPayment(id: any, dto: any, req: any) {
       // let deliveryBoy:any= await this.findDeliveryBoy(id)
        let firstdeliveryBoy:any =await this.UserModel.findOne({role:'DELIVERY'});
        let deliveryBoyId:string=firstdeliveryBoy._id;
        return this.deliveryfleetModel.findById( id ).then((data: any) => {
            data.deliverChargeType = dto.deliverChargeType;
            data.deliveryBoy=deliveryBoyId;
            data.save();
            return { deliveryFleet: data, deliveryBoy: firstdeliveryBoy }
        }, error => {
            return new BadRequestException("Invalid Invoice");
        })

    }
    async updateDeliveryStatus(id: any, dto: any, req: any) {
        let smsData:any={};
        let message:string='Byecom delivery';
        let data:any=await this.deliveryfleetModel.findOne({ _id: id }).populate("userId")          
        if(!data)
        return new BadRequestException("Invalid Delivery Request");
    
            if(dto.invoiceStatus=="progress")
            {
                let verification:any=await this.userVerificationModel.findOne({otp:dto.otp,deliveryId:id,verifiedTemplate:'deliveryProgress'})
                if(verification && !verification.verifiedStatus)
                {
                     message=message+" boy start from pickup location";
                     this.sendSms.sensSMSdelivery(req,data.userId.phoneNumber,message);
                     this.userVerificationModel.update({otp:dto.otp,deliveryId:id,verifiedTemplate:'deliveryProgress'},{$set:{verifiedStatus:true}},{$upsert:true})
                    }
                else{
                    return new BadRequestException("Invalid Otp");
                }
            }
            else if(dto.invoiceStatus=="delivered")
            {
                let verification:any=await this.userVerificationModel.findOne({otp:dto.otp,deliveryId:id,verifiedTemplate:'deliveryDelivered'})
                if(verification && !verification.verifiedStatus)
                {
                     message=message+" boy deliver the package to drop location";
                     this.sendSms.sensSMSdelivery(req,data.userId.phoneNumber,message);
                     this.userVerificationModel.update({otp:dto.otp,deliveryId:id,verifiedTemplate:'deliveryDelivered'},{$set:{verifiedStatus:true}},{$upsert:true})
                }
                else
                {
                    return new BadRequestException("Invalid Otp");
                }
            }
            else if(data.invoiceStatus=="declined")
            {
              
            }
            else if(data.invoiceStatus=="cancelled")
            {

            }
            else if(data.invoiceStatus=="pickup")
            {
                
                let code:any=await this.loginVerificationSmsOtp(id,data.userId._id,'deliveryProgress')
                code= code.otp;
                message=message+" boy delivery pickup otp "+code;
                this.sendSms.sensSMSdelivery(req,data.fromPhone,message)
            }
            else if(data.invoiceStatus=="delivered")
            {
                
                let code:any=await this.loginVerificationSmsOtp(id,data.userId._id,'deliveryDelivered')
                code= code.otp;
                message=message+" boy delivery delivered otp "+code;
                this.sendSms.sensSMSdelivery(req,data.toPhone,message)
            }
            else{
                return new BadRequestException("Invalid Delivery Fleet Request Status");
            }
            
            let updateObj:any=dto
            if(dto.loc && dto.loc.type=="Point")
            {
                updateObj.loc=dto.loc;
                data.loc=dto.loc;
            }
            if(dto.totalHrs)
             data.totalHrs=dto.totalHrs
            this.deliveryfleetModel.findOneAndUpdate({_id:id},{$set:dto},{upsert: true})
            data.invoiceStatus = dto.invoiceStatus;
           return data;
     }
    async updateDeliveryFleet(id: any, files: any, req: any) {
        let dto = req.body;
        let userid: string;
        if (req.user && req.user.user._id) {
            userid = req.user.user._id;
            dto.createdBy = userid;
            dto.modifiedBy = userid;
        }
        if (files && files.length > 0) {
            dto.goodsPhotos = files;
        }
        if (dto.loc) {

            delete req.body.loc
        }
        if(dto.toLat && dto.toLng)
        {
            dto.toLoc=
            {
                type:"Point",
                coordinates:[dto.lat,dto.lng]
            }
        }
        if(dto.fromLat && dto.fromLng)
        {
            dto.FromLoc=
            {
                type:"Point",
                coordinates:[dto.fromLat,dto.fromLng]
            }
        }
        await this.deliveryfleetModel.findOneAndUpdate({ _id: id }, { $set: dto },{$upsert:true});
        return this.deliveryfleetModel.findOne({ _id: id }).then((data: any) => {
            return data.toObject({ versionKey: false });
        }, error => {
            return new BadRequestException("Invalid Invoice");
        })

    }


    async getDeliveryFleet(user: any) {
        let where: any = {}
        if (user.role == "merchant")
            where.createdBy = user._id;
        return this.deliveryfleetModel.find(where);
    }

    async getDeliveryFleetLocationData(id: any, req: any, user:any) {
        let invoice: any = await this.deliveryfleetModel.findById(id)
         .populate("deliveryBoy")
         .populate("createdBy");
        let location:any;
        if(invoice && invoice.deliveryBoy && invoice.deliveryBoy._id)
        location= await this.LocationModel.find({deliveryId:id,userId:invoice.deliveryBoy._id})
        else
        location= await this.LocationModel.find({deliveryId:id})
        return {deliveryFleet:invoice,locations:location}
    }
    async getDeliveryFleetData(id: any, req: any) {
        let invoice: any = await this.deliveryfleetModel.findOne({ _id: id });
        return invoice.toObject({ versionKey: false });
    }

    async getDeliveryCharges(Dto: DeliveryChargesDto) {

        let dto_category = Dto.category
        let dto_weight = Dto.weight
        let dto_packages = Dto.packages
        let distenance = Dto.distenance;
        let weather = Dto.weather;
        let traffic = Dto.traffic;
        let settings = await this.SettingsModel.find({});
        let weight_price = 15;
        let packages_price = 15;
        let packaging_price = 7;
        let weather_price = 12;
        let traffic_price = 10;
        let addMP= 1;
        let addKM=300;
        let default_km=2;
        let meterPrice=0;
        let default_km_price=15;
        let default_km_price_setting:any=this.settings.find((s:any)=>(s.column_key=="default_km_price"))
        if(default_km_price_setting)
        {
            default_km_price = default_km_price_setting.column_value;
        }
        let weight_price_setting:any=this.settings.find((s:any)=>(s.column_key=="default_weight_price"))
        if(weight_price_setting)
        {
            weight_price = weight_price_setting.column_value;
        }
        let packages_price_setting:any=this.settings.find((s:any)=>(s.column_key=="default_package_price"))
        if(packages_price_setting)
        {
            packages_price = packages_price_setting.column_value;
        }
        let packing_price_setting:any=this.settings.find((s:any)=>(s.column_key=="default_packing_price"))
        if(packing_price_setting)
        {
            packaging_price = packing_price_setting.column_value;
        }
        let weather_price_setting:any=this.settings.find((s:any)=>(s.column_key=="default_weather_price"))
        if(packing_price_setting)
        {
            weather_price = packing_price_setting.column_value;
        }
        let traffic_price_setting:any=this.settings.find((s:any)=>(s.column_key=="default_traffic_price"))
        if(traffic_price_setting)
        {
            traffic_price = traffic_price_setting.column_value;
        }
        let addtion_meter_price_setting:any=this.settings.find((s:any)=>(s.column_key=="additional_km_price"))
        if(traffic_price_setting)
        {
            addMP = addtion_meter_price_setting.column_value;
        }
        let additional_km_setting:any=this.settings.find((s:any)=>(s.column_key=="additional_km"))
        if(additional_km_setting)
        {
            addKM = traffic_price_setting.column_value;
        }
        let default_km_setting:any=this.settings.find((s:any)=>(s.column_key=="default_km"))
        if(default_km_setting)
        {
            addKM = default_km_setting.column_value;
        }
        
        //weight
        let weight = await this.WeightsModel.findOne({$and:[{"category": new ObjectId(dto_category)},{from_weight: { $gte: dto_weight }},{to_weight: { $lte: dto_weight }}] })
        if (weight && dto_weight>1) {
            
            weight_price = (dto_weight*weight.rate);
            
        }

        //packages
        let packages = await this.PackagesModel.findOne({ category: new ObjectId(dto_category), from_pack: { $gte: dto_packages }, to_pack: { $lte: dto_packages } })
        if (packages && packages_price && dto_packages>1) 
        {
            packages_price = (dto_packages*packages.rate);
        }

        //packaging
        let packaging = await this.PackagingsModel.findOne({ category: new ObjectId(dto_category) });
        if (packaging) 
        {
            packaging_price = packaging.rate;
        }
        if(distenance>default_km)
        {
            let addDis=distenance-default_km;
            let met=(addDis*1000)/addKM;
            meterPrice= met*addMP;

        }
        let price:any= default_km_price+meterPrice+weight_price + packages_price + packaging_price;
        if(weather)
        {
        price=price+weather_price;
        }
        if(traffic)
        {
        price=price+traffic_price;
        }
        
        return price.toFixed(2)
    

    }
}