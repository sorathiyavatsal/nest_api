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
    dto.loc = {
      type: 'Point',
      coordinates: [dto.lat, dto.lng],
    };
    await this.usersgetModel.findOneAndUpdate(
      { _id: id },
      { $set: { loc: dto.loc } },
      { $upsert: true },
    );
    return await this.usersgetModel.findById(id).then((data) => {
      return data.toObject({ versionKey: false });
    });
  }
  async activeAccount(id: string, dto: any, user: any) {
    return await this.usersgetModel
      .findOne({ _id: new ObjectId(id) })
      .then((data) => {
        data.verifyStatus = dto.activeStatus;
        data.save();
        return data.toObject({ versionKey: false });
      });
  }
  async updateStatus(id: string, dto: any, user: any) {
    return await this.usersgetModel.findById(id).then((data) => {
      data.activeStatus = dto.activeStatus;
      data.save();
      return data.toObject({ versionKey: false });
    });
  }
  async findOneId(id: string) {
    return await this.usersgetModel.findById(id);
  }
  async findOneByEmail(email: string) {
    return await this.usersgetModel.findOne({ email: email });
  }
  async getAllUsers() {
    return await this.usersgetModel.find();
  }
}
