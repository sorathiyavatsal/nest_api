import { Holidays } from '../holiday/holiday.model';
import { Injectable, BadRequestException } from '@nestjs/common';
import { DeliveryFleet } from '../delivery_fleet/deliveryfleet.model';
import { Weights } from '../weight/weight.model';
import { Packages } from '../packages/packages.model';
import { Packagings } from '../packaging/packaging.model';
import { Settings } from '../settings/settings.model';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Profile } from '../profile/profile.model';
import { v5 as uuidv5 } from 'uuid';
import { Buffer } from 'buffer';
import { SendEmailMiddleware } from '../core/middleware/send-email.middleware';
import { throws } from 'assert';
import { User } from '../auth/user.model';
import { UserVerification } from 'src/core/models/userVerification.model';
import { DeliveryLocation } from '../delivery_fleet/deliveryLocation.model';
import { identity } from 'rxjs';
import { use } from 'passport';
import { SSL_OP_NO_TLSv1_1, SSL_OP_SSLEAY_080_CLIENT_DH_BUG } from 'constants';
let ObjectId = require('mongodb').ObjectId;

@Injectable()
export class DashboardService {
  settings: any = [];
  todayOfDay = new Date(new Date().setUTCHours(0, 0, 0, 0)).toISOString();
  todayendOfDay = new Date(
    new Date().setUTCHours(23, 59, 59, 999),
  ).toISOString();
  startOfDay = new Date(new Date().setUTCHours(0, 0, 0, 0)).toISOString();
  endOfDay = new Date(new Date().setUTCHours(23, 59, 59, 999)).toISOString();
  constructor(
    private sendSms: SendEmailMiddleware,
    @InjectModel('UserVerification')
    private userVerificationModel: Model<UserVerification>,
    @InjectModel('DeliveryFleet')
    private deliveryfleetModel: Model<DeliveryFleet>,
    @InjectModel('Weights') private WeightsModel: Model<Weights>,
    @InjectModel('Packages') private PackagesModel: Model<Packages>,
    @InjectModel('Packagings') private PackagingsModel: Model<Packagings>,
    @InjectModel('Holidays') private holidaysModel: Model<Holidays>,
    @InjectModel('Profile') private profileModel: Model<Profile>,
    @InjectModel('Settings') private SettingsModel: Model<Settings>,
    @InjectModel('User') private UserModel: Model<User>,
    @InjectModel('DeliveryLocation')
    private LocationModel: Model<DeliveryLocation>,
  ) {}
  async setDate(firstdate: any, endDate: any = '') {
    firstdate = new Date(firstdate);
    if (endDate == '') endDate = firstdate;
    endDate = new Date(endDate);
    this.startOfDay = new Date(firstdate.setUTCHours(0, 0, 0, 0)).toISOString();
    this.endOfDay = new Date(
      endDate.setUTCHours(23, 59, 59, 999),
    ).toISOString();
  }
  async tripData(filter: any, user: any) {

    const data = {"message": "Welcome Back!", 
    "token": 
    { 
        "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2MjIyZWY0MTdhZmU5YjRhMmVjMmQxNTkiLCJ1c2VySWQiOiIyMDIyMDMwNTYyIiwicGhvbmVOdW1iZXIiOiIrOTE3MjA2NzE1NTcwIiwicm9sZSI6Ik1FUkNIQU5UIiwiaWF0IjoxNjQ3MjgwODk0LCJleHAiOjE2NDg1NzY4OTR9.OuXts6SBnhSYfIkNT-pPidaoojvqUvX2DZVF7Y1vtdI"
    }, 
    "user": 
    {"__v": 0, 
    "_id": "622f82eda4c086714a242435", 
    "createdAt": "2022-03-14T18:01:17.925Z", "createdBy": "6222ef417afe9b4a2ec2d159", "createdUser": "6222ef417afe9b4a2ec2d159", "modifiedBy": "6222ef417afe9b4a2ec2d159", "otp": "8606", "updatedAt": "2022-03-14T18:01:17.925Z", "verificationType": "sms", "verifiedStatus": true, "verifiedTemplate": "loginsms", "verifiedTime": "2022-03-14T18:01:34.564Z"}}

    if (filter && filter.startDate && filter.endDate) {
      await this.setDate(filter.startDate, filter.endDate);
    } else {
      return new BadRequestException('please send valid start and end date');
    }
    //pickupDate:{$gte:this.startOfDay,$lte:this.endOfDay}
    let earnings = await this.deliveryfleetModel.aggregate([
      {
        $match: {
          pickupDate: {
            $gte: new Date(this.startOfDay),
            $lte: new Date(this.endOfDay),
          },
          invoiceStatus: 'complete',
          deliveryBoy: new ObjectId(user.user._id),
        },
      },
      {
        $project: {
          fromAddress: 1,
          toAddress: 1,
          price: 1,
          pickupDate: 1,
        },
      },
    ]);
    if (filter.startDate && filter.endDate) {
      await this.setDate(filter.startDate, filter.endDate);
    }
    //,pickupDate:{$gte:this.startOfDay,$lte:this.endOfDay}
    let graphData = await this.deliveryfleetModel.aggregate([
      {
        $match: {
          pickupDate: {
            $gte: new Date(this.startOfDay),
            $lte: new Date(this.endOfDay),
          },
          invoiceStatus: 'complete',
          deliveryBoy: user.user._id,
        },
      },
      {
        $group: {
          _id: '$deliveryBoy',
          totalPrice: { $sum: '$price' },
          totalTime: { $sum: '$totalhrs' },
          count: { $sum: 1 },
        },
      },
    ]);
    let todayData = await this.deliveryfleetModel.aggregate([
      {
        $match: {
          pickupDate: new Date(this.todayOfDay),
          invoiceStatus: 'complete',
          deliveryBoy: new ObjectId(user.user._id),
        },
      },
      {
        $project: {
          fromAddress: 1,
          toAddress: 1,
          price: 1,
          pickupDate: 1,
        },
      },
    ]);
    return { todayData: todayData, earnings: earnings, graphData: graphData };
  }
  async earningData(user: any) {
    let invoice = await this.deliveryfleetModel.aggregate([
      { $match: { deliveryBoy: user.user._id } },
      {
        $group: {
          _id: '$pickupDate',
          totalPrice: { $sum: '$price' },
          totalTime: { $sum: '$totalhrs' },
          count: { $sum: 1 },
        },
      },
    ]);
    return invoice;
  }
  async profileData(user: any) {
    let invoice: any = {};
    let resultData: any = {
      totalTrip: 0,
      totalAmount: 0,
      review: 0,
      user: user.user,
      profile: {},
    };
    let today: any = new Date();
    resultData.profile = await this.profileModel.findOne({
      userId: new ObjectId(user.user._id),
    });
    invoice = await this.deliveryfleetModel.find({
      deliveryBoy: new ObjectId(user.user._id),
    });
    resultData['totalTrip'] = invoice.length;
    resultData['totalAmount'] = 0;
    resultData['review'] = 5;
    if (invoice.length > 0) {
      for (let i = 0; i < invoice.length; i++) {
        let invoiceData = invoice[i];
        if (invoiceData.invoiceStatus == 'complete') {
          resultData['review'] = 5;
          resultData['totalAmount'] =
            resultData['totalAmount'] + invoiceData.price;
        } else resultData['review'] = resultData['review'] - 0.5;
      }
    }
    if (resultData['review'] < 3) resultData['review'] = 3.2;

    return resultData;
  }
  async dashboardData(user: any) {
    let invoice: any = {};
    let earningData: any = await this.earningData(user);
    let resultData: any = {
      todaySection: earningData,
      ongoing: [],
      upcoming: 0,
      previous: [],
    };

    invoice = await this.deliveryfleetModel.find({
      deliveryBoy: new ObjectId(user.user._id),
    });
    resultData.ongoing = await this.deliveryfleetModel.findOne({
      pickupDate: { $gte: this.startOfDay, $lte: this.endOfDay },
      $and: [
        { invoiceStatus: { $ne: 'pending' } },
        { invoiceStatus: { $ne: 'complete' } },
        { invoiceStatus: { $ne: 'declined' } },
      ],
    });
    resultData.upcoming = await this.deliveryfleetModel
      .find({
        deliveryBoy: new ObjectId(user.user._id),
        pickupDate: { $gte: this.startOfDay, $lte: this.endOfDay },
        invoiceStatus: 'accepted',
      })
      .count();
    resultData.previous = await this.deliveryfleetModel.findOne({
      deliveryBoy: new ObjectId(user.user._id),
      pickupDate: { $gte: this.startOfDay, $lte: this.endOfDay },
      invoiceStatus: 'complete',
    });

    return resultData;
  }

  async distanceReuqest(distanceRequest, user: any) {
    return {};
  }
}
