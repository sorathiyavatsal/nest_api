import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from 'src/auth/user.model';
import { DeliveryFleet } from 'src/delivery_fleet/deliveryfleet.model';
import { UserData } from 'src/user-data/user-data.model';

@Injectable()
export class DeliveryAssociatesService {
  constructor(
    @InjectModel('User') private UserModel: Model<User>,
    @InjectModel('UserData') private UserDataModel: Model<UserData>,
    @InjectModel('DeliveryFleet') private deliveryfleetModel: Model<DeliveryFleet>,
  ) { }

  async getAllDeliveryAssociates() {
    const daUser = await this.UserModel.find({role: 'DELIVERY'});
    const daDutyStatus = {};
    const daUserIds = daUser.map(x => {
      daDutyStatus[x._id.toString()] = x.liveStatus;
      return x._id;
    });
    const deliveryfleetData = await this.deliveryfleetModel.find({deliveryBoy: {$in: daUserIds}, invoiceStatus: "progress"});
    const daCurrentJobStatus = {};
    deliveryfleetData.map(x => {
      daCurrentJobStatus[x.deliveryBoy.toString()] = true;
    })

    const daUserData = await this.UserDataModel.find({userId: {$in: daUserIds}}).populate('partnerId', 'fullName');
    return daUserData.map(x => {
      return {...x.toObject({ versionKey: false }), currentJobStatus: daCurrentJobStatus[x.userId.toString()] || false, dutyStatus: daDutyStatus[x.userId.toString()]}
    });
  }
}