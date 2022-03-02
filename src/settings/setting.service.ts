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
import e from 'express';
@Injectable()
export class SettingsService {
  constructor(
    private configService: ConfigService,
    private sendEmailMiddleware: SendEmailMiddleware,
    @InjectModel('Settings') private SettingsModel: Model<Settings>,
  ) {}

  async getAllSettings(id: string, user: any, securityDto: any, zip_code: any) {
    let query =
      zip_code !== undefined
        ? {
            _id: id,
            'metaValue.zipcode': { $in: [zip_code] },
          }
        : { _id: id };
    const settings = await this.SettingsModel.findOne(query);
    return this.SettingsModel.find(query);
  }
  async getSettingsDetail(id: any) {
    return this.SettingsModel.findById(id);
  }
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

  async updateSettings(
    id: string,
    zip_code: any,
    securityDto: EditSettingsDto,
    user: any,
  ) {
    try {
      let query =
        zip_code !== undefined
          ? {
              _id: id,
              'metaValue.zipcode': zip_code,
            }
          : { _id: id };
      if (zip_code !== undefined) {
        const response = await this.SettingsModel.updateOne(query, {
          $set: {
            'metaValue.$.status': securityDto.status,
          },
        });
        return response;
      } else {
        const response1 = await this.SettingsModel.updateOne(
          { _id: id },
          {
            $push: {
              metaValue: {
                zipcode: securityDto.zipcode,
                areaName: securityDto.areaName,
                status: securityDto.status,
              },
            },
          },
        );
        return response1;
      }
    } catch (error) {
      console.log(error);
    }
  }

  async createSettings(securityDto: CreateSettingsDto, user: any) {
    const newUser = new this.SettingsModel({
      metaKey: securityDto.metaKey,
      metaValue: securityDto.metaValue,
    });
    return await newUser.save().then(
      (user: any) => {
        return user.toObject({ versionKey: false });
      },
      (error) => {
        let msg = 'Invalid Request!';
        if (error.errmsg) msg = error.errmsg;
        return new BadRequestException(msg);
      },
    );
  }
  async deleteSettings(id: string): Promise<any> {
    return await this.SettingsModel.findByIdAndRemove(id);
  }
  async taxSettings(_id: string, securityDto: any) {
    return await this.SettingsModel.updateOne(
      { _id: _id },
      {
        'metaValue.name': securityDto.name,
        'metaValue.type': securityDto.type,
        'metaValue.value': securityDto.value,
      },
    );
  }

  async updatecharges(id: string, securityDto: EditSettingsDto, zip_code: any) {
    try {
      let query =
        zip_code !== undefined
          ? {
              _id: id,
              'metaValue.zipcode': { $in: [zip_code] },
            }
          : { _id: id };

      const settings = await this.SettingsModel.findOne(query);
      if (zip_code !== undefined) {
        const { zipcode }: any = settings.metaValue[0];

        const res = await this.SettingsModel.updateOne(query, {
          $set: {
            'metaValue.$.zipcode': [...zipcode, securityDto.zipcode],
            'metaValue.$.fuelCharged.default_km': securityDto.default_km,
            'metaValue.$.fuelCharged.default_km_charge':
              securityDto.default_km_charge,
            'metaValue.$.fuelCharged.addition_charge':
              securityDto.addition_charge,
            'metaValue.$.weather_charge.default_m':
              securityDto.default_weather_m,
            'metaValue.$.weather_charge.meter_charge':
              securityDto.meter_wether_charge,
            'metaValue.$.traffic_charge.default_m':
              securityDto.default_traffic_m,
            'metaValue.$.traffic_charge.meter_charge':
              securityDto.meter_traffice_charge,
          },
        });
        return res;
      } else {
        const response1 = await this.SettingsModel.updateOne(
          { _id: id },
          {
            $push: {
              metaValue: {
                zipcode: securityDto.zipcode,
                fuelCharged: {
                  default_km: securityDto.default_km,
                  default_km_charge: securityDto.default_km_charge,
                  addition_charge: securityDto.addition_charge,
                },
                weather_charge: {
                  default_m: securityDto.default_weather_m,
                  meter_charge: securityDto.meter_wether_charge,
                },
                traffic_charge: {
                  default_m: securityDto.default_traffic_m,
                  meter_charge: securityDto.meter_traffice_charge,
                },
              },
            },
          },
        );
        return response1;
      }
    } catch (e) {
      console.log(e);
    }
  }

  async orderSettings(id: string, CreateOrderSettingsDto: any): Promise<any> {
    console.log(CreateOrderSettingsDto);
    return await this.SettingsModel.updateOne(
      { _id: id },
      { ...CreateOrderSettingsDto },
    );
  }

  async getDelieveryAssociates() {
    return this.SettingsModel.find({});
  }
}
