import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Revenue } from './revenue.model';
let ObjectId = require('mongodb').ObjectId;

@Injectable()
export class RevenueService {
  constructor(@InjectModel('Revenue') private revenueModel: Model<Revenue>) { }

  async getAllRevenues() {
    return await this.revenueModel.find({});
  }

  async getRevenueDetail(id: string) {
    return await this.revenueModel.findOne({ _id: ObjectId(id) });
  }

  async addRevenue(revenueDto: any) {
    const newStoreComm = new this.revenueModel(revenueDto);
    return await newStoreComm.save().then(
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

  async updateRevenue(id: any, revenueDto: any) {
    return await this.revenueModel.findOneAndUpdate(
      { _id: ObjectId(id) },
      { $set: revenueDto },
      { new: true, upsert: true },
    ).then(data => {
      return data.toObject({ versionKey: false });
    }).catch(err => {
      console.log(err);
      return new BadRequestException(err);
    });;
  }
}
