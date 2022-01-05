import { Holidays } from '../holiday/holiday.model';
import { Injectable, BadRequestException } from '@nestjs/common';
import { DeliveryFleet } from '../delivery_fleet/deliveryfleet.model';
import { Weights } from '../weight/weight.model';
import { Category } from '../category/category.model';
import { Packages } from '../packages/packages.model';
import { Packagings } from '../packaging/packaging.model';
import { Settings } from '../settings/settings.model';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { v5 as uuidv5 } from 'uuid';
import { Buffer } from 'buffer'
import { SendEmailMiddleware } from '../core/middleware/send-email.middleware';
import { throws } from 'assert';
import { User } from "../auth/user.model";
import { UserVerification } from 'src/core/models/userVerification.model';
import { DeliveryLocation } from '../delivery_fleet/deliveryLocation.model';
import { identity } from 'rxjs';
import { use } from 'passport';
import { SSL_OP_NO_TLSv1_1, SSL_OP_SSLEAY_080_CLIENT_DH_BUG } from 'constants';
@Injectable()
export class DashboardService {
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
        @InjectModel('User') private UserModel: Model<User>,
        @InjectModel('DeliveryLocation') private LocationModel :  Model<DeliveryLocation>
    ){}
    async todayDate(date)
    {
        let data:any=new Date(date);
        return data.substr(0,15)
    }
    async tripData(user:any) {
        
        let  invoice = await this.deliveryfleetModel.aggregate([
            {$match:{deliveryBoy: user.user._id}},
            { $group: { _id:  "$pickupDate",
                        totalPrice: { $sum: "$price" },
                        fromAddress:1,
                        toAddress:1,
                        count: { $sum: 1 }
                     } }
                    ]);
        return invoice;
    
    } 
    async earningData(user:any) {
        
            let  invoice = await this.deliveryfleetModel.aggregate([
                {$match:{deliveryBoy: user.user._id}},
                { $group: { _id:  "$pickupDate",
                            totalPrice: { $sum: "$price" },
                            count: { $sum: 1 }
                         } }
                        ]);
            return invoice;
        
      }       
    async profileData(user:any) {
        let invoice: any ={};
        let resultData:any=[];
        let today:any=new Date();
        
             invoice = await this.deliveryfleetModel.find({ deliveryId: user._id });
             resultData['totalTrip'] = invoice.length;
             resultData['totalAmount']=0;
             resultData['review'] =5;
                if( invoice.length>0)
                {
                    for(let i=0;i< invoice.length;i++)
                    {
                        if(invoice.invoiceStatus=="Complete")
                        {
                        resultData['review'] =5;
                        resultData['totalAmount']=resultData['totalAmount']+invoice.price
                        }
                        else
                        resultData['review'] =resultData['review']-0.5;
                    }
                }
            if(resultData['review']<3) resultData['review']=3.2;
            resultData['todayTotal']=resultData['previousTotal']+(resultData.ongoing?resultData.ongoing.price:0);
        
        return resultData;
    }
    async dashboardData(user:any) {
        let invoice: any ={};
        let resultData:any=[];
        let today:any=new Date();
        
             invoice = await this.deliveryfleetModel.find({ deliveryId: user._id });
             resultData['ongoing'] = invoice.find((n:any)=>(this.todayDate(n.pickupDate)==today.substr(0,15) && n.invoiceStatus!='pending' && n.invoiceStatus!='complete' && n.invoiceStatus!='declined'))
             resultData['upcoming'] = invoice.filter((n:any)=>(this.todayDate(n.pickupDate)==today.substr(0,15) && n.invoiceStatus=='accepted')).length;
             resultData['previous'] = invoice.filter((n:any)=>(this.todayDate(n.pickupDate)==today.substr(0,15) &&  n.invoiceStatus=='complete'))
             resultData['previousTotal']=0;
                if( resultData['previous'].length>0)
                {
                    for(let i=0;i< resultData['previous'].length;i++)
                    {
                        resultData['previousTotal']=resultData['previousTotal']+resultData['previous'][i]['price']
                    }
                }
            
            resultData['todayTotal']=resultData['previousTotal']+(resultData.ongoing?resultData.ongoing.price:0);
        
        return resultData;
    }
}
