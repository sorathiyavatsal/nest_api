import { Injectable, BadRequestException } from '@nestjs/common';
import { Holidays } from './holiday.model';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateHolidaysDto } from './dto/create-holiday';
import { EditHolidaysDto } from './dto/edit-holiday';
import { v5 as uuidv5 } from 'uuid';
import { ConfigService } from 'src/core/config/config.service';
import { SendEmailMiddleware } from '../core/middleware/send-email.middleware';
@Injectable()
export class HolidaysService {
  constructor(
    private configService: ConfigService,
    private sendEmailMiddleware: SendEmailMiddleware,
    @InjectModel('Holidays') private HolidaysModel: Model<Holidays>,
  ) {}

  async getAllHolidays(user: any) {
    return this.HolidaysModel.find({});
  }
  async getHolidaysDetail(id: any) {
    return this.HolidaysModel.findById(id);
  }
  async updateHolidays(id: string, holidaysDto: EditHolidaysDto, user: any) {
    return this.HolidaysModel.findById({ _id: id }).then(
      (data) => {
        data.name = holidaysDto.name;
        data.fromDate = holidaysDto.fromDate;
        data.toDate = holidaysDto.toDate;
        data.activeStatus = holidaysDto.activeStatus;
        data.modifiedBy = user._id;
        data.save();
        return data.toObject({ versionKey: false });
      },
      (error) => {
        let msg = 'Invalid Request!';
        if (error.errmsg) msg = error.errmsg;
        return new BadRequestException(msg);
      },
    );
  }
  async createHolidays(holidaysDto: CreateHolidaysDto, user: any) {
    const MY_NAMESPACE = holidaysDto.name;
    const newUser = new this.HolidaysModel(holidaysDto);
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

  async deleteHolidays(id: string): Promise<any> {
    return await this.HolidaysModel.findByIdAndRemove(id);
  }
}
