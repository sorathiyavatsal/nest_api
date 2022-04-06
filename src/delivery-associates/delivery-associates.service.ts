import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from 'src/auth/user.model';
import { DeliveryFleet } from 'src/delivery_fleet/deliveryfleet.model';
import { UserData } from 'src/user-data/user-data.model';
var _ = require('underscore');

@Injectable()
export class DeliveryAssociatesService {
  constructor(
    @InjectModel('User') private UserModel: Model<User>,
    @InjectModel('UserData') private UserDataModel: Model<UserData>,
    @InjectModel('DeliveryFleet')
    private deliveryfleetModel: Model<DeliveryFleet>,
  ) {}

  async getAllDeliveryAssociates(dto: any) {
    const daUser = await this.UserModel.find({ role: 'DELIVERY' });
    const daDutyStatus = {};
    const daUserIds = daUser.map((x) => {
      daDutyStatus[x._id.toString()] = x.liveStatus ?? false;
      return x._id;
    });

    const deliveryfleetData = await this.deliveryfleetModel.find({
      deliveryBoy: { $in: daUserIds },
    });
    const daCurrentJobStatus = {};
    deliveryfleetData.map((x) => {
      daCurrentJobStatus[x.deliveryBoy.toString()] = true;
    });

    const daUserData = await this.UserDataModel.find({
      userId: { $in: daUserIds },
    }).populate('userId', 'loc');
    const partnerIds = daUserData.map((x) => x.partnerId);
    const partnerData = await this.UserDataModel.find({
      userId: { $in: partnerIds },
    });
    const partnerFullName = {};
    partnerData.map((x) => {
      partnerFullName[x.userId.toString()] = x.fullName;
    });

    var responseAssociate = await daUserData.map((x) => {
      return {
        ...x.toObject({ versionKey: false }),
        partnerId: {
          _id: x.partnerId,
          fullName: partnerFullName[x.partnerId.toString()],
        },
        currentJobStatus: daCurrentJobStatus[x.userId.toString()] || false,
        dutyStatus: daDutyStatus[x.userId.toString()] || false,
      };
    });

    if (dto.duty_status) {
      responseAssociate = _.filter(
        responseAssociate,
        (e) => e.dutyStatus == dto.duty_status,
      );
    }

    if (dto.job_status) {
      responseAssociate = _.filter(
        responseAssociate,
        (e) => e.currentJobStatus == dto.job_status,
      );
    }

    if (dto.vehicle_number) {
      responseAssociate = _.filter(responseAssociate, (e) => {
        if (e.vehicle_no) {
          return e.vehicle_no.includes(dto.vehicle_number);
        }
      });
    }

    if (dto.vehicle_type) {
      responseAssociate = _.filter(responseAssociate, (e) => {
        if (e.vehicle_type) {
          return e.vehicle_type.includes(dto.vehicle_type);
        }
      });
    }

    if (dto.work_load) {
      responseAssociate = _.filter(
        responseAssociate,
        (e) => e.job_type == dto.work_load,
      );
    }

    if (dto.partnerId) {
      responseAssociate = _.filter(
        responseAssociate,
        (e) => e.partnerId._id == dto.partnerId,
      );
    }

    responseAssociate = await responseAssociate.slice(
      dto.page ?? 0,
      dto.limit ?? 20,
    );

    return {
      deliveryAssociate: responseAssociate,
      page:
        responseAssociate.length / (dto.limit ?? 20) <= 1
          ? 0
          : responseAssociate.length / (dto.limit ?? 20),
    };
  }
}
