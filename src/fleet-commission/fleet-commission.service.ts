import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { FleetCommission } from './fleet-commission.model';
import { Injectable, BadRequestException } from '@nestjs/common';
import { UserData } from 'src/user-data/user-data.model';
let ObjectId = require('mongodb').ObjectId;

@Injectable()
export class FleetCommissionService {
  constructor(
    @InjectModel('FleetCommission')
    private fleetCommissionModel: Model<FleetCommission>,
    @InjectModel('UserData') private UserDataModel: Model<UserData>,
  ) {}
  async getAllFleetCommission(filter: any) {
    return await this.fleetCommissionModel.find({
      name: { $regex: filter.name || '', $options: 'i' },
    });
  }

  async getAllFleetCommissionEarning(dto: any) {
    const userData = await this.UserDataModel.findOne({
      userId: ObjectId(dto.deliveryBoyId),
    });

    const fleetCommission = await this.fleetCommissionModel.findOne({
      name: userData['job_type'],
    });

    if (userData['job_type'] == 'Flat') {
      return {
          earning: fleetCommission.fix
      };
    } else {
      return {
        earning:dto.hours * fleetCommission.additionalPerHour
      };
    }
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
    return await this.fleetCommissionModel
      .findOneAndUpdate({ _id: new ObjectId(id) }, { $set: dto }, { new: true })
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
