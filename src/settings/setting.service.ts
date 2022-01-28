import { Injectable, BadRequestException } from '@nestjs/common';
import { Settings } from './settings.model';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateSettingsDto } from './dto/create-settings';
import { EditSettingsDto } from './dto/edit-settings';
import { v5 as uuidv5 } from 'uuid';
import { ConfigService } from 'src/core/config/config.service';
import { SendEmailMiddleware } from './../core/middleware/send-email.middleware';
import { UseRoles } from 'nest-access-control';
@Injectable()
export class SettingsService {
  constructor(
    private configService: ConfigService,
    private sendEmailMiddleware: SendEmailMiddleware,
    @InjectModel('Settings') private SettingsModel: Model<Settings>,
  ) {}

  async getAllSettings(user: any) {
    return this.SettingsModel.find({});
  }
  async getSettingsDetail(id: any) {
    return this.SettingsModel.findById(id);
  }
  async updateSettings(
    id: string,
    zip_code: any,
    securityDto: EditSettingsDto,
    user: any,
  ) {
    let query =
      zip_code !== ''
        ? {
            _id: id,
            'delivery_service_array.zip_code': zip_code,
          }
        : { _id: id };
    console.log(query);
    return this.SettingsModel.findOne(query).then(
      async data => {
        console.log(data, 'Datatta');
        if (zip_code !== '') {
          console.log('hje;lo update');
          await data.updateOne(query, {
            $set: {
              'delivery_service_array.$.city':
                securityDto['delivery_service_array.city'],
              'delivery_service_array.$.state_name':
                securityDto['delivery_service_array.state_name'],
              'delivery_service_array.$.zip_code':
                securityDto['delivery_service_array.zip_code'],
              'delivery_service_array.$.acive':
                securityDto['delivery_service_array.acive'],
            },
          });
        } else {
          console.log('123213 update', query);
          console.log('123443 update', securityDto);

          const res = await data.updateOne(
            query,
            {
              $set: {
                delivery_service_array: securityDto.delivery_service_array,
              },
            },
            { upsert: true },
          );
          console.log(res, 'resss');
        }
        return data.toObject({ versionKey: false });
      },
      error => {
        let msg = 'Invalid Request!';
        if (error.errmsg) msg = error.errmsg;
        return new BadRequestException(msg);
      },
    );
  }
  async createSettings(securityDto: CreateSettingsDto, user: any) {
    const newUser = new this.SettingsModel({
      delivery_service_array: securityDto.delivery_service_array,
    });
    return await newUser.save().then(
      (user: any) => {
        return user.toObject({ versionKey: false });
      },
      error => {
        let msg = 'Invalid Request!';
        if (error.errmsg) msg = error.errmsg;
        return new BadRequestException(msg);
      },
    );
  }
  async deleteSettings(id: string): Promise<any> {
    return await this.SettingsModel.findByIdAndRemove(id);
  }
  async taxSettings(id: string): Promise<any> {
    return await {};
  }
  async orderSettings(id: string): Promise<any> {
    return await {};
  }
}
