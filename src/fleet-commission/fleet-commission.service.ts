import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { FleetCommission } from './fleet-commission.model';
import { Injectable, BadRequestException } from '@nestjs/common';
let ObjectId = require('mongodb').ObjectId;

@Injectable()
export class FleetCommissionService {
  constructor(@InjectModel('FleetCommission') private fleetCommissionModel: Model<FleetCommission>) { }
  async getAllFleetCommission(filter: any) {
    return await this.fleetCommissionModel.find({ name: { $regex: filter.name || '', $options: 'i' } });
  }

  async getFleetCommissionById(id: string) {
    return await this.fleetCommissionModel.findById(id).then((data) => {
      return data.toObject({ versionKey: false });
    });
  }

  async addNewFleetCommission(dto: any) {
    const newfleetCommission = new this.fleetCommissionModel(dto);

    return await newfleetCommission.save().then(
      (data: any) => {
        return data.toObject({ versionKey: false });
      },
      (error) => {
        let msg = 'Invalid Request!';
        if (error.errmsg) msg = error.errmsg;
        return new BadRequestException(msg);
      },
    );
  }

  async updateFleetCommission(id: string, dto: any) {
    return await this.fleetCommissionModel.findOneAndUpdate(
      { _id: new ObjectId(id) },
      { $set: dto },
      { new: true }
    )
      .then(
        (data: any) => {
          return data.toObject({ versionKey: false });
        },
        (error) => {
          let msg = 'Something went wrong!';
          if (error.errmsg) msg = error.errmsg;
          return new BadRequestException(msg);
        },
      );
  }
}
