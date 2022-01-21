import { Injectable, BadRequestException } from '@nestjs/common';
import { Settings } from './settings.model';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateSettingsDto } from './dto/create-settings';
import { EditSettingsDto } from './dto/edit-settings';
import { v5 as uuidv5 } from 'uuid';
import { ConfigService } from 'src/core/config/config.service';
import { SendEmailMiddleware } from './../core/middleware/send-email.middleware';
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
      zip_code !== undefined
        ? {
            _id: id,
            'delivery_service_array.zip_code': zip_code,
          }
        : { _id: id };

    const updateBody = zip_code
      ? {
          $set: {
            'delivery_service_array.$.city':
              securityDto.delivery_service_array.city,
            'delivery_service_array.$.state_name':
              securityDto.delivery_service_array.state_name,
            'delivery_service_array.$.zip_code':
              securityDto.delivery_service_array.zip_code,
            'delivery_service_array.$.active':
              securityDto.delivery_service_array.active,
          },
        }
      : {
          $addToSet: {
            delivery_service_array: securityDto.delivery_service_array,
          },
        };
    return await this.SettingsModel.updateOne(query, updateBody);
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
}
