import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Earning } from './earnings.model';
let ObjectId = require('mongodb').ObjectId;
var _ = require('underscore');

@Injectable()
export class EarningsService {
  constructor(@InjectModel('Earning') private EarningModel: Model<Earning>) {}

  async getAllEarning(EarningDto: any) {
    var earningResult = await this.EarningModel.aggregate([
      {
        $lookup: {
          from: 'deliveryfleets',
          localField: 'JobId',
          foreignField: '_id',
          as: 'deliveryfleetsDetails',
        },
      },
      {
        $unwind: {
          path: '$deliveryfleetsDetails',
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $lookup: {
          from: 'users',
          localField: 'deliveryBoyId',
          foreignField: '_id',
          as: 'deliveryBoyDetails',
        },
      },
      {
        $unwind: {
          path: '$deliveryBoyDetails',
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $lookup: {
          from: 'settlements',
          localField: 'settlmentId',
          foreignField: '_id',
          as: 'settlementsDetails',
        },
      },
      {
        $unwind: {
          path: '$settlementsDetails',
          preserveNullAndEmptyArrays: true,
        },
      },
    ]);

    if (EarningDto.to_date) {
      earningResult = _.filter(
        earningResult,
        (e) => new Date(e.startDateTime) >= new Date(EarningDto.to_date),
      );
    }

    if (EarningDto.from_date) {
      earningResult = _.filter(
        earningResult,
        (e) => new Date(e.startDateTime) <= new Date(EarningDto.from_date),
      );
    }

    if(EarningDto.id) {
        earningResult = _.filter(
            earningResult,
            (e) => e.deliveryBoyId == EarningDto.id,
          );
    }

    return earningResult;
  }

  async getEarning(earningId: String) {
    return await this.EarningModel.aggregate([
      {
        $lookup: {
          from: 'deliveryfleets',
          localField: 'JobId',
          foreignField: '_id',
          as: 'deliveryfleetsDetails',
        },
      },
      {
        $unwind: {
          path: '$deliveryfleetsDetails',
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $lookup: {
          from: 'users',
          localField: 'deliveryBoyId',
          foreignField: '_id',
          as: 'deliveryBoyDetails',
        },
      },
      {
        $unwind: {
          path: '$deliveryBoyDetails',
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $lookup: {
          from: 'settlements',
          localField: 'settlmentId',
          foreignField: '_id',
          as: 'settlementsDetails',
        },
      },
      {
        $unwind: {
          path: '$settlementsDetails',
          preserveNullAndEmptyArrays: true,
        },
      },
      { $match: { _id: ObjectId(earningId) } },
    ]);
  }

  async postEarning(EarningDto: any) {
    let Earning = {
      JobId: EarningDto.JobId,
      deliveryBoyId: EarningDto.deliveryBoyId,
      workedHours: EarningDto.workedHours,
      travelledKMs: EarningDto.travelledKMs,
      amount: EarningDto.amount,
      startDateTime: EarningDto.startDateTime,
      endDateTime: EarningDto.endDateTime,
      settlmentId: EarningDto.settlmentId,
    };

    return await new this.EarningModel(Earning).save();
  }
}
