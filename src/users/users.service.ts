import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from '../auth/user.model';
import { Profile } from 'src/profile/profile.model';
let ObjectId = require('mongodb').ObjectId;
@Injectable()
export class UsersService {
  user: any;
  constructor(
    @InjectModel('User') private usersgetModel: Model<User>,
    @InjectModel('Profile') private ProfileModel: Model<Profile>,
  ) {}

  async updateLocation(id: string, dto: any) {
    dto.loc = [dto.lat, dto.lng];
    await this.usersgetModel.findOneAndUpdate(
      { _id: id },
      { $set: { loc: dto.loc } },
      { $upsert: true },
    );
    return await this.usersgetModel.findById(id).then((data) => {
      return data.toObject({ versionKey: false });
    });
  }

  async activeAccount(id: string, dto: any) {
    return await this.usersgetModel.findOneAndUpdate(
      { _id: new ObjectId(id) },
      { $set: { activeStatus: dto.activeStatus } },
      { $upsert: true }
    );
  }

  async updateStatus(id: string, dto: any) {
    return await this.usersgetModel.findOneAndUpdate(
        { _id: new ObjectId(id) },
        { $set: { liveStatus: dto.liveStatus } },
        { $upsert: true }
      );
  }
  async findOneId(id: string) {
    return await this.usersgetModel.findById(id);
  }
  async findOneByEmail(email: string) {
    return await this.usersgetModel.findOne({ email: email });
  }
  async getAllUsers(filter) {
    const query: any = {};
    filter &&
      Object.keys(filter).length &&
      Object.keys(filter).map((x) => {
        if (x === 'email') {
          query.email = { $regex: filter.email || '', $options: 'i' };
        } else {
          query[x] = filter[x];
        }
      });
    return await this.usersgetModel.find(query);
  }
  async addEditSavedAddress(id: string, dto: any, user: any) {
    const existingAddress = await this.usersgetModel.findOneAndUpdate(
      {
        _id: new ObjectId(id),
        ...(dto.savedAddressId
          ? { 'savedAddress._id': new ObjectId(dto.savedAddressId) }
          : { 'savedAddress.lan': dto.lan, 'savedAddress.lng': dto.lng }),
      },
      {
        $set: {
          'savedAddress.$': dto,
        },
      },
      { new: true },
    );

    if (existingAddress) {
      return existingAddress.toObject({ versionKey: false });
    }

    return await this.usersgetModel
      .findOne({ _id: new ObjectId(id) })
      .then((data) => {
        data.savedAddress.push(dto);
        data.save();
        return data.toObject({ versionKey: false });
      });
  }

  async addprofile(dto: any, user: any) {
      let data = {}
      if(!dto["savedAddress"]){
        data["savedAddress"] = []
      }

        if(dto.email) {
            data['email'] = dto.email
        }
        if(dto.emailVerified) {
            data["emailVerified"] = dto.emailVerified
        }
        if(dto.gender){
            
        }
        
        if(dto.dateofbirth) {

        }
        
        if(dto.profilePhoto) {

        }
        if(dto.address) {

        }
        if(dto.phoneNumber) {

        }
        // fullName
        // role
        // userId
        // deviceId
        // verifyType
        // liveStatus
        // phoneVerified
        // permissions
        // loc
        // activeStatus
        // password
        // verifyStatus
        // savedAddress
    
    dto["password"] = Math.floor(Math.random() * 1000000000).toString()
    const userdata = await new this.usersgetModel(dto).save()

    return userdata;
  }
}
