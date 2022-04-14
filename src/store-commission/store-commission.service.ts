import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { StoreCommission } from './store-commission.model';
let ObjectId = require('mongodb').ObjectId;

@Injectable()
export class StoreCommissionService {
  constructor(@InjectModel('StoreCommission') private StoreCommissionModel: Model<StoreCommission>) { }

  async getAllStoreCommissions() {
    return await this.StoreCommissionModel.find({});
  }

  async getStoreCommissionDetail(id: string) {
    return await this.StoreCommissionModel.findOne({ _id: ObjectId(id) });
  }

  async addStoreCommission(storeCommDto: any) {
    const newStoreComm = new this.StoreCommissionModel(storeCommDto);
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

  async updateStoreCommission(id: any, storeCommDto: any) {
    return await this.StoreCommissionModel.findOneAndUpdate(
      { _id: ObjectId(id) },
      { $set: storeCommDto },
      { new: true, upsert: true },
    ).then((data) => {
      return data.toObject({ versionKey: false });
    }).catch(err => {
        console.log(err);
        return new BadRequestException(err);
    });
  }
}

