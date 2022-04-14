import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { FleetCommission } from 'src/fleet-commission/fleet-commission.model';
import { UserData } from 'src/user-data/user-data.model';
import { Earning } from './earnings.model';
let ObjectId = require('mongodb').ObjectId;
var _ = require('underscore');

@Injectable()
export class EarningsService {
  constructor(
    @InjectModel('Earning') private EarningModel: Model<Earning>,
    @InjectModel('UserData') private UserDataModel: Model<UserData>,
    @InjectModel('FleetCommission')
    private fleetCommissionModel: Model<FleetCommission>,
  ) {}

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
        (e) => new Date(e.startDateTime) <= new Date(EarningDto.to_date),
      );
    }

    if (EarningDto.from_date) {
      earningResult = _.filter(
        earningResult,
        (e) => new Date(e.startDateTime) >= new Date(EarningDto.from_date),
      );
    }

    if (EarningDto.id) {
      earningResult = _.filter(
        earningResult,
        (e) => e.deliveryBoyId == EarningDto.userId,
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
      startDateTime: EarningDto.startDateTime,
      endDateTime: EarningDto.endDateTime,
    };

    if (EarningDto.settlmentId) {
      Earning['settlmentId'] = EarningDto.settlmentId;
    }

    

    const userData = await this.UserDataModel.findOne({
      userId: ObjectId(EarningDto.deliveryBoyId),
    });

    console.log(userData);

    const fleetCommission = await this.fleetCommissionModel.findOne({
      name: userData['job_type'],
    });

    if (userData['job_type'] == 'Flat') {
      Earning['amount'] = fleetCommission.fix;
    } else {
      Earning['amount'] =
        EarningDto.workedHours * fleetCommission.additionalPerHour;
    }

    return await new this.EarningModel(Earning).save();
  }
}
