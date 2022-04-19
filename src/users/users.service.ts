import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from '../auth/user.model';
import { Profile } from 'src/profile/profile.model';
import { UserData } from 'src/user-data/user-data.model';
let ObjectId = require('mongodb').ObjectId;
@Injectable()
export class UsersService {
  user: any;
  constructor(
    @InjectModel('User') private usersgetModel: Model<User>,
    @InjectModel('UserData') private UserDataModel: Model<UserData>,
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
      { $upsert: true },
    );
  }

  async updateStatus(id: string, dto: any) {
    return await this.usersgetModel.findOneAndUpdate(
      { _id: new ObjectId(id) },
      { $set: { liveStatus: dto.liveStatus } },
      { $upsert: true },
    );
  }
  async findOneId(id: string) {
      var userData = await this.UserDataModel.findOne({
        userId: ObjectId(id)
      })
      var user = JSON.parse(JSON.stringify(await this.usersgetModel.findById(id)))
     user["userData"] = userData;

     return user
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
    let data = {};
    if (!dto['savedAddress']) {
      data['savedAddress'] = [];
    }
    if (dto.email) {
      data['email'] = dto.email;
    }
    if (dto.emailVerified) {
      data['emailVerified'] = dto.emailVerified;
    }
    if (dto.gender) {
      data['gender'] = dto.gender;
    }
    if (dto.dateofbirth) {
      data['dateofbirth'] = dto.dateofbirth;
    }
    if (dto.profilePhoto) {
      data['profilePhoto'] = dto.profilePhoto;
    }
    if (dto.address) {
      data['address'] = dto.address;
    }
    if (dto.phoneNumber) {
      data['phoneNumber'] = dto.phoneNumber;
    }
    if (dto.fullName) {
      data['fullName'] = dto.fullName;
    }
    if (dto.role) {
      data['role'] = dto.role;
    }
    if (dto.liveStatus) {
      data['liveStatus'] = dto.liveStatus;
    }
    if (dto.phoneVerified) {
      data['phoneVerified'] = dto.phoneVerified;
    }
    if (dto.permissions) {
      data['permissions'] = dto.permissions;
    }
    if (dto.loc) {
      data['loc'] = dto.loc;
    }
    if (dto.activeStatus) {
      data['activeStatus'] = dto.activeStatus;
    }
    if (dto.verifyStatus) {
      data['verifyStatus'] = dto.verifyStatus;
    }

    data['password'] = Math.floor(Math.random() * 1000000000).toString();

    const userdata = await new this.usersgetModel(data).save();

    return userdata;
  }
}
