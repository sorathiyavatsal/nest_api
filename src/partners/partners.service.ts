import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreatePartnerDto } from './dto/create-partners'
import { GetPartnerDto } from './dto/get-partners'
import { EditPartnerDto } from './dto/edit-partners'
import { Partners } from './partners.model';
import { UserData } from 'src/user-data/user-data.model';
@Injectable()
export class PartnersService {

  constructor(
    @InjectModel('Partners') private PartnersModel: Model<Partners>,
    @InjectModel('UserData') private UserDataModel: Model<UserData>,
  ) { }

  async getAllPartners() {
    const partnersCount = await this.UserDataModel.aggregate([
      { $match: { partnerId: { $exists: true } } },
      { $group: { _id: '$partnerId', count: { $sum: 1 } } },
    ]);
    const partnersContObj = {};
    const partnerIds = partnersCount.map(x => { partnersContObj[x._id.toString()] = x.count; return x._id });
    
    const partners = await this.UserDataModel.find({
      userId: { $in: partnerIds }
    })

    return partners.map(data => {
      return { ...data.toObject({versionKey: false}), DA: partnersContObj[data.userId.toString()] }
    })
  }

  async postPartners(createPartnerDto: CreatePartnerDto) {
    const newPartners = new this.PartnersModel({
      name: createPartnerDto.Name,
      contact: createPartnerDto.Contact,
      address: {
        street: createPartnerDto.Street,
        street2: createPartnerDto.Street2,
        landmark: createPartnerDto.Landmark,
        city: createPartnerDto.City,
        state: createPartnerDto.State
      },
      allocated_DAs: createPartnerDto.DAs,
      allocated_zipcodes: createPartnerDto.AllocatedZipCodes
    });

    return await newPartners.save();
  }

  async putPartners(editPartnerDto: EditPartnerDto, userId: String) {
    const updatedPartner = await this.PartnersModel.updateOne(userId, {
      name: editPartnerDto.Name,
      contact: editPartnerDto.Contact,
      address: {
        street: editPartnerDto.Street,
        street2: editPartnerDto.Street2,
        landmark: editPartnerDto.Landmark,
        city: editPartnerDto.City,
        state: editPartnerDto.State
      },
      allocated_DAs: editPartnerDto.DAs,
      allocated_zipcodes: editPartnerDto.AllocatedZipCodes
    });

    return updatedPartner;
  }

  async deletePartners(userId: String) {
    const updatedPartner = await this.PartnersModel.deleteOne(userId);

    return updatedPartner;
  }
}
