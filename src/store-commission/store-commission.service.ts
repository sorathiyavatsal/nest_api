import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { StoreCommission } from './store-commission.model';
let ObjectId = require('mongodb').ObjectId;
import { Categories } from '../category/category.model';
let _ = require('underscore');

@Injectable()
export class StoreCommissionService {
  constructor(
    @InjectModel('StoreCommission')
    private StoreCommissionModel: Model<StoreCommission>,
    @InjectModel('categories') private categoriesModel: Model<Categories>,
  ) {}

  async getAllStoreCommissions(dto: any) {
    var store_commission = await this.StoreCommissionModel.find({});

    for (let i = 0; i < store_commission.length; i++) {
      for (let j = 0; j < store_commission[i].values.length; j++) {
        if (store_commission[i].values[j]['categoryId']) {
          store_commission[i].values[j]['category'] =
            await this.categoriesModel.findOne({
              _id: ObjectId(store_commission[i].values[j]['categoryId']),
            });
        }
      }
    }

    if (dto.commissionType) {
      store_commission = _.filter(
        store_commission,
        (e) => e.commissionType == dto.commissionType,
      );
    }

    if (dto.applicableType) {
      store_commission = _.filter(
        store_commission,
        (e) => e.applicableType == dto.applicableType,
      );
    }

    if (dto.planCode) {
      store_commission = _.filter(
        store_commission,
        (e) => e.planCode == dto.planCode,
      );
    }

    return {
      store_commission: store_commission.slice(dto.page ?? 0, dto.limit ?? 20),
      count: store_commission.length,
      page: Math.ceil(store_commission.length / (dto.limit ? dto.limit : 20)),
    };
  }

  async getStoreCommissionDetail(id: string) {
    var store_commission = await this.StoreCommissionModel.findOne({
      _id: ObjectId(id),
    });
    return store_commission;
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
    )
      .then((data) => {
        return data.toObject({ versionKey: false });
      })
      .catch((err) => {
        console.log(err);
        return new BadRequestException(err);
      });
  }
}
