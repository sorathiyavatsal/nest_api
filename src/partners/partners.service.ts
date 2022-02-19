import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreatePartnerDto } from './dto/create-partners'
import { GetPartnerDto } from './dto/get-partners'
import { EditPartnerDto } from './dto/edit-partners'
import { Partners } from './partners.model';
@Injectable()
export class PartnersService {

  constructor(
    @InjectModel('Partners') private PartnersModel: Model<Partners>,
  ) { }

  async getAllPartners(getPartnerDto: GetPartnerDto) {
    let partners = {}
    if (getPartnerDto.partner) {
      partners = await this.PartnersModel.find({
        '_id': {
          $in: getPartnerDto.partner
        },
        status: true
      })
    } else {
      partners = await this.PartnersModel.find({ status: true })
    }

    return partners
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
