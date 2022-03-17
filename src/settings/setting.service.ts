import { Injectable, BadRequestException } from '@nestjs/common';
import { Settings } from './settings.model';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateSettingsDto } from './dto/create-settings';
import { EditSettingsDto } from './dto/edit-settings';
import { v5 as uuidv5 } from 'uuid';
import { ConfigService } from 'src/core/config/config.service';
import { SendEmailMiddleware } from './../core/middleware/send-email.middleware';
import { CreateTaxSettingsDto } from './dto/tax-settings';
import { ThisMonthInstance } from 'twilio/lib/rest/api/v2010/account/usage/record/thisMonth';
import express from 'express';
let ObjectId = require('mongodb').ObjectId;
@Injectable()
export class SettingsService {
  constructor(
    private configService: ConfigService,
    private sendEmailMiddleware: SendEmailMiddleware,
    @InjectModel('Settings') private SettingsModel: Model<Settings>,
  ) {}

  // async getAllSettings(id: string, user: any, securityDto: any, zip_code: any) {
  //   let query =
  //     zip_code !== undefined
  //       ? {
  //           _id: id,
  //           'metaValue.zipcode': { $in: [zip_code] },
  //         }
  //       : { _id: id };
  //   const settings = await this.SettingsModel.findOne(query);
  //   return this.SettingsModel.find(query);
  // }
  // async getSettings(securityDto: any) {
  //   try {
  //     const metaKey = await securityDto.metakey
  //     console.log(metaKey)
  //     if (!metaKey) {
  //       const withoutBody = await this.SettingsModel.find({})
  //       return withoutBody
  //     }
  //     else {
  //       const withBody = await this.SettingsModel.findOne({ metaKey: metaKey })
  //       return withBody

  //     }

  //   } catch (error) {
  //     console.log(error)
  //   }
  // }
  // async updateSettings(
  //   id: string,
  //   zip_code: any,
  //   securityDto: EditSettingsDto,
  //   user: any,
  // ) {
  //   let query =
  //     zip_code !== ''
  //       ? {
  //           _id: id,
  //           'metaValue._id': '6214bb352278ce53e7ea79e4',
  //         }
  //       : { _id: id };
  //   console.log(query);
  //   return this.SettingsModel.findOne(query).then(
  //     async (data) => {
  //       await data.updateOne(query, {
  //         $set: {
  //           'metaValue.$.status': 'Deactive',
  //         },
  //       });
  //       return data.toObject({ versionKey: false });
  //     },
  //     (error) => {
  //       let msg = 'Invalid Request!';
  //       if (error.errmsg) msg = error.errmsg;
  //       return new BadRequestException(msg);
  //     },
  //   );
  // }

  // async updateSettings(
  //   id: string,
  //   zip_code: any,
  //   securityDto: EditSettingsDto,
  //   user: any,
  // ) {
  //   try {
  //     let query =
  //       zip_code !== undefined
  //         ? {
  //             _id: id,
  //             'metaValue.zipcode': zip_code,
  //           }
  //         : { _id: id };
  //     if (zip_code !== undefined) {
  //       const response = await this.SettingsModel.updateOne(query, {
  //         $set: {
  //           'metaValue.$.status': securityDto.status,
  //         },
  //       });
  //       return response;
  //     } else {
  //       const response1 = await this.SettingsModel.updateOne(
  //         { _id: id },
  //         {
  //           $push: {
  //             metaValue: {
  //               zipcode: securityDto.zipcode,
  //               areaName: securityDto.areaName,
  //               status: securityDto.status,
  //             },
  //           },
  //         },
  //       );
  //       return response1;
  //     }
  //   } catch (error) {
  //     console.log(error);
  //   }
  // }

  // async createSettings(securityDto: CreateSettingsDto, user: any) {
  //   const newUser = new this.SettingsModel({
  //     metaKey: securityDto.metaKey,
  //     metaValue: securityDto.metaValue,
  //   });
  //   return await newUser.save().then(
  //     (user: any) => {
  //       return user.toObject({ versionKey: false });
  //     },
  //     (error) => {
  //       let msg = 'Invalid Request!';
  //       if (error.errmsg) msg = error.errmsg;
  //       return new BadRequestException(msg);
  //     },
  //   );
  // }
  // async deleteSettings(id: string): Promise<any> {
  //   return await this.SettingsModel.findByIdAndRemove(id);
  // }
  // async taxSettings(_id: string, securityDto: any) {
  //   return await this.SettingsModel.updateOne(
  //     { _id: _id },
  //     {
  //       'metaValue.name': securityDto.name,
  //       'metaValue.type': securityDto.type,
  //       'metaValue.value': securityDto.value,
  //     },
  //   );
  // }

  // async updatecharges(id: string, securityDto: EditSettingsDto, zip_code: any) {
  //   try {
  //     let query =
  //       zip_code !== undefined
  //         ? {
  //             _id: id,
  //             'metaValue.zipcode': { $in: [zip_code] },
  //           }
  //         : { _id: id };

  //     const settings = await this.SettingsModel.findOne(query);
  //     if (zip_code !== undefined) {
  //       const { zipcode }: any = settings.metaValue[0];

  //       const res = await this.SettingsModel.updateOne(query, {
  //         $set: {
  //           'metaValue.$.zipcode': [...zipcode, securityDto.zipcode],
  //           'metaValue.$.fuelCharged.default_km': securityDto.default_km,
  //           'metaValue.$.fuelCharged.default_km_charge':
  //             securityDto.default_km_charge,
  //           'metaValue.$.fuelCharged.addition_charge':
  //             securityDto.addition_charge,
  //           'metaValue.$.weather_charge.default_m':
  //             securityDto.default_weather_m,
  //           'metaValue.$.weather_charge.meter_charge':
  //             securityDto.meter_wether_charge,
  //           'metaValue.$.traffic_charge.default_m':
  //             securityDto.default_traffic_m,
  //           'metaValue.$.traffic_charge.meter_charge':
  //             securityDto.meter_traffice_charge,
  //         },
  //       });
  //       return res;
  //     } else {
  //       const response1 = await this.SettingsModel.updateOne(
  //         { _id: id },
  //         {
  //           $push: {
  //             metaValue: {
  //               zipcode: securityDto.zipcode,
  //               fuelCharged: {
  //                 default_km: securityDto.default_km,
  //                 default_km_charge: securityDto.default_km_charge,
  //                 addition_charge: securityDto.addition_charge,
  //               },
  //               weather_charge: {
  //                 default_m: securityDto.default_weather_m,
  //                 meter_charge: securityDto.meter_wether_charge,
  //               },
  //               traffic_charge: {
  //                 default_m: securityDto.default_traffic_m,
  //                 meter_charge: securityDto.meter_traffice_charge,
  //               },
  //             },
  //           },
  //         },
  //       );
  //       return response1;
  //     }
  //   } catch (e) {
  //     console.log(e);
  //   }
  // }

  // async orderSettings(id: string, CreateOrderSettingsDto: any): Promise<any> {
  //   console.log(CreateOrderSettingsDto);
  //   return await this.SettingsModel.updateOne(
  //     { _id: id },
  //     { ...CreateOrderSettingsDto },
  //   );
  // }

  async getDelieveryAssociates(query) {
    const condition = {
      ...(query?.metaKey ? { metaKey: query.metaKey } : {}),
    };
    return this.SettingsModel.find(condition);
  }

  async addServiceAreaSettingsDetail(settingDto: any) {
    const setting = await this.SettingsModel.findOne({ metaKey: 'service_area' });
    if (setting) {
      const settingQuery = {
        _id: setting._id,
        'metaValue.zipcode': settingDto.zipcode
      };
      const updatedSetting1 = await this.SettingsModel.findOneAndUpdate(settingQuery, {
        $set: {
          'metaValue.$.status': settingDto.status,
          'metaValue.$.areaName': settingDto.areaName,
          'metaValue.$.zipcode': settingDto.zipcode
        },
      }, { new: true });
      if (updatedSetting1) {
        return updatedSetting1.toObject({ versionKey: false });
      } else {
        const updatedSetting2 = await this.SettingsModel.findOneAndUpdate({ _id: setting._id }, {
          $push: {
            metaValue: {
              status: settingDto.status,
              areaName: settingDto.areaName,
              zipcode: settingDto.zipcode
            }
          },
        }, { new: true });
        return updatedSetting2.toObject({ versionKey: false });
      }
    } else {
      const settingModel = {
        metaKey: 'service_area',
        metaValue: [{
          zipcode: settingDto.zipcode,
          areaName: settingDto.areaName,
          status: settingDto.status,
        }],
      }
      const newSetting = new this.SettingsModel(settingModel);

      return await newSetting.save().then(
        (s: any) => {
          return s.toObject({ versionKey: false });
        },
        (error) => {
          let msg = 'Invalid Request!';
          if (error.errmsg) msg = error.errmsg;
          console.log(error);
          return new BadRequestException(msg);
        },
      );
    }
  }

  async addOrUpdateFuelCharges(fuelChargesDto: any){
    const fuelChargesData = await this.SettingsModel.findOne({metaKey: 'fuel_charge'});
    const metaValueModel = {
      metaValue: [{
        _id: new ObjectId(),
        zipcode: fuelChargesDto.zipcode,
        fuelCharged: {
          default_km: fuelChargesDto.default_km,
          default_km_charge: fuelChargesDto.default_km_charge,
          addition_charge: fuelChargesDto.addition_charge,
        },
        weather_charge: {
          default_m: fuelChargesDto.default_weather_m,
          meter_charge: fuelChargesDto.meter_wether_charge,
        },
        traffic_charge: {
          default_m: fuelChargesDto.default_traffic_m,
          meter_charge: fuelChargesDto.meter_traffice_charge,
        },
      }],
    };
    if(fuelChargesData){
      const isExisting = await this.checkZipcodeExistForFuelCharges(fuelChargesData._id, fuelChargesDto.zipcode, fuelChargesDto?._id || null);
      if(isExisting[0]){
        return new BadRequestException(`[${isExisting[1]}] zipcode are already exist, please remove this zipcode!`);
      }
      if(fuelChargesDto?._id){
        const fuelChargesQuery = {
          _id: fuelChargesData._id,
          'metaValue._id': ObjectId(fuelChargesDto?._id)
        }
        const existingFuelSetting = await this.SettingsModel.findOneAndUpdate(fuelChargesQuery, {
          $set: {
            'metaValue.$.zipcode': fuelChargesDto.zipcode,
            'metaValue.$.fuelCharged.default_km': fuelChargesDto.default_km,
            'metaValue.$.fuelCharged.default_km_charge': fuelChargesDto.default_km_charge,
            'metaValue.$.fuelCharged.addition_charge': fuelChargesDto.addition_charge,
            'metaValue.$.weather_charge.default_m': fuelChargesDto.default_weather_m,
            'metaValue.$.weather_charge.meter_charge': fuelChargesDto.meter_wether_charge,
            'metaValue.$.traffic_charge.default_m': fuelChargesDto.default_traffic_m,
            'metaValue.$.traffic_charge.meter_charge': fuelChargesDto.meter_traffice_charge,
          }
        }, { new: true });
        if(existingFuelSetting)
          return existingFuelSetting.toObject({versionKey: false});
      }
      const newFuelSetting = await this.SettingsModel.findOneAndUpdate({_id: fuelChargesData._id}, {
        $push: {
          metaValue: {
            ...metaValueModel.metaValue[0]
          }
        }
      }, { new: true });
      return newFuelSetting.toObject({versionKey: false});
    }else{
      const settingModel = {
        metaKey: 'fuel_charge',
        ...metaValueModel,
      }
      const newSetting = new this.SettingsModel(settingModel);

      return await newSetting.save().then(
        (s: any) => {
          return s.toObject({ versionKey: false });
        },
        (error) => {
          let msg = 'Invalid Request!';
          if (error.errmsg) msg = error.errmsg;
          console.log(error);
          return new BadRequestException(msg);
        },
      );
    }
  }

  async checkZipcodeExistForFuelCharges(id: any, zipcodes: any, fuelChargeId: any){
    const zipcodeExistQuery = {
      _id: id,
      ...(fuelChargeId ? {'metaValue._id': {$ne: ObjectId(fuelChargeId)}} : {}),
      'metaValue.zipcode': { $in: zipcodes}
    }
    const existingZipcode = await this.SettingsModel.findOne(zipcodeExistQuery);
    if(existingZipcode){
      const zipcodeArr = existingZipcode.metaValue.map((x: any)=>{
        const tempArr = [];
        x.zipcode.map(z => {
          if(zipcodes.includes(z)) tempArr.push(z);
        });
        return tempArr;
      })
      return [true, zipcodeArr.reduce((acc, val) => acc.concat(val), []).toString()];
    }
    return [false, null];
  }

  async addNewSetting(settingObjectTypeDto: any){
    const updatedSetting = await this.SettingsModel.findOneAndUpdate({metaKey: settingObjectTypeDto.metaKey},{
      $set: {
        metaValue: Object.keys(settingObjectTypeDto.metaValue).length ? {...settingObjectTypeDto.metaValue} : settingObjectTypeDto.metaValue,
      }
    }, { new: true });
    if(updatedSetting)
      return updatedSetting.toObject({versionKey: false});

    const newSetting = new this.SettingsModel(settingObjectTypeDto);
    return await newSetting.save().then(
      (s: any) => {
        return s.toObject({ versionKey: false });
      },
      (error) => {
        let msg = 'Invalid Request!';
        if (error.errmsg) msg = error.errmsg;
        console.log(error);
        return new BadRequestException(msg);
      },
    );
  }
}
