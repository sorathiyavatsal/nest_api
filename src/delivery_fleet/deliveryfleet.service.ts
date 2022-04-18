import { Holidays } from '../holiday/holiday.model';
import { Injectable, BadRequestException } from '@nestjs/common';
import { DeliveryFleet } from './deliveryfleet.model';
import { Weights } from '../weight/weight.model';
import { Packages } from '../packages/packages.model';
import { Packagings } from '../packaging/packaging.model';
import { Settings } from '../settings/settings.model';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { DeliveryChargesDto } from './dto/deliverycharges';
import { SendEmailMiddleware } from '../core/middleware/send-email.middleware';
import { User } from '../auth/user.model';
import { UserVerification } from 'src/core/models/userVerification.model';
import { DeliveryLocation } from './deliveryLocation.model';
import { UserLogin } from 'src/core/models/userLogin.model';
import { Notification } from 'src/notification/notification.model';
let ObjectId = require('mongodb').ObjectId;
var _ = require('underscore');
@Injectable()
export class DeliveryFleetService {
  settings: any = [];
  constructor(
    private sendEmailMiddleware: SendEmailMiddleware,
    @InjectModel('UserVerification')
    private userVerificationModel: Model<UserVerification>,
    @InjectModel('DeliveryFleet')
    private deliveryfleetModel: Model<DeliveryFleet>,
    @InjectModel('Weights') private WeightsModel: Model<Weights>,
    @InjectModel('Packages') private PackagesModel: Model<Packages>,
    @InjectModel('Packagings') private PackagingsModel: Model<Packagings>,
    @InjectModel('Holidays') private holidaysModel: Model<Holidays>,
    @InjectModel('Settings') private SettingsModel: Model<Settings>,
    @InjectModel('Users') private UserModel: Model<User>,
    @InjectModel('DeliveryLocation')
    private LocationModel: Model<DeliveryLocation>,
    @InjectModel('UserLogin') private UserLogin: Model<UserLogin>,
    @InjectModel('Notification') private NotificationModel: Model<Notification>,
  ) {}
  async createnewDeliveryFleet(files: any, req: any) {
    let today = new Date();
    today.setHours(23);
    today.setMinutes(59);
    today.setSeconds(59);
    let holidays = await this.holidaysModel.find({
      $or: [
        {
          fromDate: {
            $gte: new Date(req.body.pickupDate),
            $lt: new Date(req.body.pickupDate),
          },
        },
        {
          fromDate: {
            $gte: new Date(req.body.pickupDate),
            $lt: new Date(today),
          },
        },
      ],
    });
    if (holidays.length > 0) {
      return new BadRequestException(req.body.pickupDate + ' is holiday');
    }
    let dto = req.body;
    let userid: string;
    if (req.user && req.user._id) {
      userid = req.user._id;
      dto.createdBy = userid;
      dto.modifiedBy = userid;
    }
    if (files && files.length > 0) {
      dto.goodsPhotos = files;
    }
    if (dto.loc && dto.loc.type != 'Point') {
      delete req.body.loc;
    }
    // dto.toLoc = {
    //   type: 'Point',
    //   coordinates: [dto.toLat, dto.toLng],
    // };
    // dto.FromLoc = {
    //   type: 'Point',
    //   coordinates: [dto.fromLat, dto.fromLng],
    // };
    delete dto.pickupTime;
    const invoiceData = new this.deliveryfleetModel(dto);

    return await invoiceData.save().then((newInvoice: any) => {
      new this.NotificationModel({
        userId: ObjectId(userid),
        type: 'GENERAL',
        operation: 'NEW FLEET REQUEST',
        title: 'Your Fleet Job',
        content: 'You have create new fleet',
        status: 'SEND',
        extraData: {
          notification_details: {
            id: ObjectId(newInvoice._id),
            type: 'FLEET',
            status: newInvoice.invoiceStatus,
          },
        },
      }).save();

      if (!newInvoice) {
        return new BadRequestException('Invalid Invoice');
      } else if (
        newInvoice &&
        newInvoice.createdBy &&
        newInvoice.createdBy != ''
      ) {
        return { invoice: newInvoice, redirect: false };
      } else {
        return { invoice: newInvoice, redirect: true };
      }
    });
  }
  async getDeliveyBoyNear(order: any) {
    let settings = await this.settingsData();

    let radius = settings.find((s: any) => s.metaKey == 'radius');

    if (radius) {
      let radiusmeter: any = radius.metaValue;
      let deliveryBoy = await this.UserModel.find({
        role: 'DELIVERY',
        verifyStatus: true,
        liveStatus: true,
        loc: {
          $geoWithin: {
            $centerSphere: [
              [order.fromLat, order.fromLng],
              (radiusmeter * 0.000621371) / 3963.2,
            ],
          },
        },
      });

      return { boys: deliveryBoy, dto: order, radius };
    }
  }

  async updateLocationDeliveryFleet(id: any, dto: any, req: any, user: any) {
    let today = new Date();
    today.setHours(23);
    today.setMinutes(59);
    today.setSeconds(59);
    let holidays = await this.holidaysModel.find({
      $or: [
        {
          fromDate: {
            $gte: new Date(req.body.pickupDate),
            $lt: new Date(req.body.pickupDate),
          },
        },
        {
          fromDate: {
            $gte: new Date(req.body.pickupDate),
            $lt: new Date(today),
          },
        },
      ],
    });
    if (holidays.length > 0) {
      return new BadRequestException(req.body.pickupDate + ' is holiday');
    }

    let userid: string = user;
    dto.modifiedBy = userid;

    if (dto.loc && dto.loc.type != 'Point') {
      delete dto.loc;
      return new BadRequestException('Invalid Location');
    } else {
      await this.LocationModel.findOneAndUpdate(
        { deliveryId: id, userId: user._id },
        { $set: dto.loc },
        { $upsert: true },
      );
      await this.UserModel.findOneAndUpdate(
        { _id: user._id },
        { $set: dto.loc },
        { $upsert: true },
      );
    }
    await this.deliveryfleetModel.findOneAndUpdate(
      { _id: id },
      { $set: dto },
      { $upsert: true },
    );
    return this.deliveryfleetModel.findOne({ _id: id }).then(
      (data: any) => {
        return data.toObject({ versionKey: false });
      },
      (error) => {
        return new BadRequestException('Invalid Location');
      },
    );
  }
  async settingsData() {
    return this.SettingsModel.find({});
  }
  async findDeliveryBoy(id: string) {
    let delivery: any = this.deliveryfleetModel.findById(id);
    if (!delivery) {
      return new BadRequestException('Invalid Delivery Fleet');
    }
    let settings = await this.settingsData();
    let maxDis: any = 4;
    let minDis: any = 2;
    let max_dis_data: any = this.settings.find(
      (s: any) => s.column_key == 'max_distance_find',
    );
    if (max_dis_data) {
      maxDis = max_dis_data.column_value;
      if (parseInt(maxDis)) maxDis = maxDis * 1000;
    }
    let min_dis_data: any = this.settings.find(
      (s: any) => s.column_key == 'max_distance_find',
    );
    if (min_dis_data) {
      minDis = min_dis_data.column_value;
      if (parseInt(minDis)) minDis = minDis * 1000;
    }
    let deliveryBoy: any = await this.UserModel.find({
      role: 'DELIVERY',
      activeStatus: true,
      verifyStatus: true,
      loc: {
        $near: {
          $geometry: {
            type: 'Point',
            coordinates: [
              parseInt(delivery.fromLat),
              parseInt(delivery.fromLng),
            ],
          },
          $maxDistance: maxDis,
        },
      },
    });
    return deliveryBoy;
  }

  async getDeliveryFleetBoy(dto: any, userId: String) {
    let condition = {};

    if (dto.userType == 'GENERAL') {
      condition['createdBy'] = ObjectId(userId);
    } else {
      condition['deliveryBoy'] = ObjectId(userId);
    }

    if (dto.status) {
      condition['invoiceStatus'] = dto.status;
    }

    var deliveryFleets = await this.deliveryfleetModel.find(condition);

    if (dto.userType == 'GENERAL') {
      if (dto.to_date) {
        deliveryFleets = _.filter(
          deliveryFleets,
          (e) => new Date(e.createdAt) <= new Date(dto.to_date),
        );
      }

      if (dto.from_date) {
        deliveryFleets = _.filter(
          deliveryFleets,
          (e) => new Date(e.createdAt) >= new Date(dto.from_date),
        );
      }
    } else {
      if (dto.to_date) {
        deliveryFleets = _.filter(
          deliveryFleets,
          (e) => new Date(e.updatedAt) <= new Date(dto.to_date),
        );
      }

      if (dto.from_date) {
        deliveryFleets = _.filter(
          deliveryFleets,
          (e) => new Date(e.updatedAt) >= new Date(dto.from_date),
        );
      }
    }

    return deliveryFleets;
  }

  async updateDeliveryFleetBoy(id: any, req: any, user: any) {
    let delivery: any = await this.deliveryfleetModel
      .findOne({ _id: id })
      .populate('userId');
    if (!delivery) {
      return new BadRequestException('Invalid Delivery Fleet');
    }

    let dto = req.body;
    let updateObj: any = {
      deliveryBoy: user.user._id,
      invoiceStatus: 'accepted',
    };
    if (dto.loc && dto.loc.type == 'Point') updateObj.loc = dto.loc;
    await this.deliveryfleetModel.findOneAndUpdate(
      { _id: id },
      { $set: updateObj },
      { upsert: true },
    );

    const mailOptions = {
      name: 'DELIVERY_FLEET_ORDER_ACCEPTED',
      type: 'SMS',
      device: req.headers.OsName || 'ANDROID',
      phone: delivery.toPhone,
    };
    this.sendEmailMiddleware.sendEmailOrSms(mailOptions);

    // //let smsData:any=await this.loginVerificationSmsOtp(delivery.userId)
    // let message: string = 'Byecom delivery accept your delivery  fleet order';
    // this.sendEmailMiddleware.sensSMSdelivery(req, delivery.userId.phoneNumber, message);
    return { msg: 'Trip is started successfully' };
  }
  async loginVerificationSmsOtp(
    userId,
    id: string,
    template: string = 'deliverystartsms',
  ) {
    await this.userVerificationModel.deleteMany({
      verificationType: template,
      deliverId: id,
    });
    let verifiedTemplate = template;
    const newTokenVerifyEmail = new this.userVerificationModel({
      verificationType: 'sms',
      verifiedTemplate: verifiedTemplate,
      deliveryId: id,
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
    let firstdeliveryBoy: any = await this.UserModel.findOne({
      role: 'DELIVERY',
    });
    let deliveryBoyId: string = firstdeliveryBoy._id;
    return this.deliveryfleetModel.findById(id).then(
      (data: any) => {
        data.deliverChargeType = dto.deliverChargeType;
        data.deliveryBoy = deliveryBoyId;
        data.save();
        return { deliveryFleet: data, deliveryBoy: firstdeliveryBoy };
      },
      (error) => {
        return new BadRequestException('Invalid Invoice');
      },
    );
  }
  async updateDeliveryStatus(id: any, dto: any, req: any) {
    let smsData: any = {};
    let message: string = 'Byecom delivery';
    let data: any = await this.deliveryfleetModel
      .findOne({ _id: id })
      .populate('deliveryBoy');

    if (!data) return new BadRequestException('Invalid Delivery Request');

    if (dto.invoiceStatus == 'progress') {
      let verification: any = await this.userVerificationModel.findOne({
        otp: dto.otp,
        deliveryId: id,
        verifiedTemplate: 'deliveryProgress',
      });
      if (verification && !verification.verifiedStatus) {
        const mailOptions = {
          name: 'DELIVERY_INPROGRESS',
          type: 'SMS',
          device: req.headers.OsName || 'ANDROID',
          phone: data.userId.phoneNumber,
        };
        this.sendEmailMiddleware.sendEmailOrSms(mailOptions);

        // message = message + ' boy start from pickup location';
        // this.sendEmailMiddleware.sensSMSdelivery(req, data.userId.phoneNumber, message);
        this.userVerificationModel.update(
          {
            otp: dto.otp,
            deliveryId: id,
            verifiedTemplate: 'deliveryProgress',
          },
          { $set: { verifiedStatus: true } },
          { $upsert: true },
        );
      } else {
        return new BadRequestException('Invalid Otp');
      }
    } else if (dto.invoiceStatus == 'dispatched') {
      let verification: any = await this.userVerificationModel.findOne({
        otp: dto.otp,
        createdUser: ObjectId(id),
        verifiedTemplate: 'deliveryProgress',
      });

      if (verification && !verification.verifiedStatus) {
        const mailOptions = {
          name: 'DELIVERY_DISPATCHED',
          type: 'SMS',
          device: 'ANDROID',
          phone: data.fromPhone,
        };

        this.sendEmailMiddleware.sendEmailOrSms(mailOptions);

        this.userVerificationModel.update(
          {
            otp: dto.otp,
            createdUser: ObjectId(id),
            verifiedTemplate: 'deliveryDelivered',
          },
          { $set: { verifiedStatus: true } },
          { $upsert: true },
        );
      } else {
        return new BadRequestException('Invalid Otp');
      }
    } else if (dto.invoiceStatus == 'declined') {
    } else if (dto.invoiceStatus == 'cancelled') {
    } else if (dto.invoiceStatus == 'pickup') {
      let code: any = await this.loginVerificationSmsOtp(
        id,
        data.deliveryBoy._id,
        'deliveryProgress',
      );
      code = code.otp;

      const mailOptions = {
        name: 'DELIVERY_PICKUP_OTP',
        type: 'SMS',
        device: 'MOBILE',
        phone: data.fromPhone,
        otp: code,
      };
      this.sendEmailMiddleware.sendEmailOrSms(mailOptions);

      // message = message + ' boy delivery pickup otp ' + code;
      // this.sendEmailMiddleware.sensSMSdelivery(req, data.fromPhone, message);
    } else if (dto.invoiceStatus == 'delivered') {
      let code: any = await this.loginVerificationSmsOtp(
        id,
        data.userId,
        'deliveryDelivered',
      );
      code = code.otp;

      const mailOptions = {
        name: 'DELIVERY_DELIVERED_OTP',
        type: 'SMS',
        device: 'ANDROID',
        phone: data.toPhone,
        otp: code,
      };

      this.sendEmailMiddleware.sendEmailOrSms(mailOptions);
    } else if (dto.invoiceStatus == 'complete') {
      let verification: any = await this.userVerificationModel.findOne({
        otp: dto.otp,
        createdUser: ObjectId(id),
        verifiedTemplate: 'deliveryDelivered',
      });

      if (verification && !verification.verifiedStatus) {
        const mailOptions = {
          name: 'DELIVERY_DELIVERED_OTP',
          type: 'SMS',
          device: 'ANDROID',
          phone: data.fromPhone,
        };

        this.sendEmailMiddleware.sendEmailOrSms(mailOptions);

        this.userVerificationModel.update(
          {
            otp: dto.otp,
            createdUser: ObjectId(id),
            verifiedTemplate: 'deliveryComplete',
          },
          { $set: { verifiedStatus: true } },
          { $upsert: true },
        );
      } else {
        return new BadRequestException('Invalid Otp');
      }
    } else {
      return new BadRequestException('Invalid Delivery Fleet Request Status');
    }

    let updateObj: any = dto;
    if (dto.loc && dto.loc.type == 'Point') {
      updateObj.loc = dto.loc;
      data.loc = dto.loc;
    }
    if (dto.totalHrs) data.totalHrs = dto.totalHrs;

    await this.deliveryfleetModel.updateOne(
      { _id: ObjectId(id) },
      { $set: dto },
      { upsert: true },
    );
    data.invoiceStatus = dto.invoiceStatus;
    return data;
  }

  async updateDeliveryFleet(id: any, files: any, req: any) {
    let dto = req.body;
    let userid: string;
    if (req.user && req.user.user._id) {
      userid = req.user.user._id;
      const checkCreatedById = await this.deliveryfleetModel.findOne({
        _id: id,
      });
      if (checkCreatedById.createdBy) {
        dto.createdBy = userid;
      }
      dto.modifiedBy = dto.createdBy;
    }
    if (files && files.length > 0) {
      dto.goodsPhotos = files;
    }
    if (dto.loc) {
      delete req.body.loc;
    }
    if (dto.toLat && dto.toLng) {
      dto.toLoc = {
        type: 'Point',
        coordinates: [dto.lat, dto.lng],
      };
    }
    if (dto.fromLat && dto.fromLng) {
      dto.FromLoc = {
        type: 'Point',
        coordinates: [dto.fromLat, dto.fromLng],
      };
    }
    await this.deliveryfleetModel.findOneAndUpdate(
      { _id: id },
      { $set: dto },
      { $upsert: true },
    );
    return this.deliveryfleetModel.findOne({ _id: id }).then(
      (data: any) => {
        return data.toObject({ versionKey: false });
      },
      (error) => {
        return new BadRequestException('Invalid Invoice');
      },
    );
  }

  async getDeliveryFleet(user: any, filter: any) {
    let where = [];
    if (filter.merchantid) {
      where.push({
        $match: {
          createdBy: ObjectId(filter.merchantid),
        },
      });
    }

    where.push(
      {
        $skip: filter.page ? parseInt(filter.page) * parseInt(filter.limit) : 0,
      },
      { $limit: filter.limit ? parseInt(filter.limit) : 20 },
    );

    var fleet = JSON.parse(
      JSON.stringify(await this.deliveryfleetModel.aggregate(where)),
    );

    return {
      fleet: fleet,
      pages: filter.page
        ? Math.ceil(fleet.length / filter.limit ? filter.limit : 20) - 1
        : 0,
    };
  }

  async getDeliveryFleetLocationData(id: any, req: any, user: any) {
    let invoice: any = await this.deliveryfleetModel
      .findById(id)
      .populate('deliveryBoy')
      .populate('createdBy');
    let location: any;
    if (invoice && invoice.deliveryBoy && invoice.deliveryBoy._id)
      location = await this.LocationModel.find({
        deliveryId: id,
        userId: invoice.deliveryBoy._id,
      });
    else location = await this.LocationModel.find({ deliveryId: id });
    return { deliveryFleet: invoice, locations: location };
  }
  async getDeliveryFleetData(id: any, req: any) {
    let invoice: any = await this.deliveryfleetModel.findOne({ _id: id });
    return invoice.toObject({ versionKey: false });
  }

  async getDeliveryCharges(Dto: DeliveryChargesDto) {
    try {
      let category = Dto.category;
      let weight = Dto.weight;
      let packages = Dto.packages;
      let distenance = Dto.distenance;
      let weather = Dto.weather;
      let traffic = Dto.traffic;

      let fleet_tax = await this.SettingsModel.findOne({
        metaKey: 'fleet_tax',
      });
      let settings = await this.SettingsModel.findOne({
        metaKey: 'fuel_charge',
        'metaValue.zipcode': { $in: [Dto.zipcode] },
      });
      let zipSettings = settings['metaValue'].find((s) =>
        s['zipcode'].includes(Dto.zipcode),
      );
      if (!zipSettings) {
        zipSettings = settings['metaValue'].find((s) =>
          s['zipcode'].filter((zip) => zip == 0),
        );
      }

      let weight_collection = await this.WeightsModel.findOne({
        from_weight: { $lte: weight },
        to_weight: { $gte: weight },
        category: category,
        activeStatus: true,
      });
      let weight_price = weight_collection.rate;

      let packages_collection = await this.PackagesModel.findOne({
        from_pack: { $lte: packages },
        to_pack: { $gte: packages },
        category: category,
        activeStatus: true,
      });

      let packages_price = packages_collection ? packages_collection.rate : 0;

      let default_km_charge = zipSettings['fuelCharged'].default_km_charge;
      let default_km = zipSettings['fuelCharged'].default_km;
      let tax = fleet_tax.metaValue['value'];
      let taxType = fleet_tax.metaValue['type'];
      let additional_km_charge = 0;
      if (distenance > default_km) {
        let additional_m = distenance - default_km;
        additional_km_charge =
          ((additional_m * 1000) / 100) *
          zipSettings['fuelCharged'].addition_charge;
      }

      let packaging = await this.PackagingsModel.findOne({
        category: category,
      });

      let packaging_price = packaging ? packaging.rate : 0;
      let response = {
        default_km_price: default_km_charge,
        weight_price: weight_price,
        packages_price: packages_price,
        packaging_price: packaging_price,
        weather_price: 0,
        traffic_price: 0,
        tax: 0,
        subtotal: 0,
        total: 0,
      };

      let price =
        default_km_charge +
        additional_km_charge +
        weight_price +
        packages_price +
        packaging_price;

      if (weather) {
        let km_m =
          (distenance * 1000) / zipSettings['weather_charge'].default_m;
        let weather_price = km_m * zipSettings['weather_charge'].meter_charge;
        price = price + weather_price;
        response.weather_price = weather_price;
      }
      if (traffic) {
        let km_m =
          (distenance * 1000) / zipSettings['traffic_charge'].default_m;
        let traffic_price = km_m * zipSettings['traffic_charge'].meter_charge;
        price = price + traffic_price;
        response.traffic_price = traffic_price;
      }
      response.subtotal = price;
      response.tax = taxType == 'flat' ? tax : tax / 100;
      response.total = taxType == 'flat' ? price + tax : price + tax / 100;
      return response;
    } catch (error) {
      console.log(error);
    }
  }
}
