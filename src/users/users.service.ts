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
      userId: ObjectId(id),
    });
    var user = JSON.parse(
      JSON.stringify(await this.usersgetModel.findById(id)),
    );
    user['userData'] = userData;

    return user;
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

  async updateProfile(id: string, files: any, profileDto: any) {
    let updateData = {};
    let updateUser = {};

    if (profileDto.gender) {
      updateData['gender'] = profileDto.gender;
    }
    if (profileDto.dob) {
      updateData['dob'] = profileDto.dob;
      updateUser['dateofbirth'] = profileDto.dob;
    }
    if (profileDto.fullName) {
      updateData['fullName'] = profileDto.fullName;
      updateUser['fullName'] = profileDto.fullName;
    }
    if (profileDto.shop_name) {
      updateData['shop_name'] = profileDto.shop_name;
    }
    if (profileDto.shop_address) {
      updateData['shop_address'] = profileDto.shop_address;
    }
    if (profileDto.shop_located_at) {
      updateData['shop_located_at'] = profileDto.shop_located_at;
    }
    if (profileDto.sell_items) {
      updateData['sell_items'] = profileDto.sell_items;
    }
    if (profileDto.adharcard_no) {
      updateData['adharcard_no'] = profileDto.adharcard_no;
    }
    if (profileDto.pancard_no) {
      updateData['pancard_no'] = profileDto.pancard_no;
    }
    if (profileDto.gst_no) {
      updateData['gst_no'] = profileDto.gst_no;
    }
    if (profileDto.gst_image) {
      updateData['gst_image'] = profileDto.gst_image;
    }
    if (profileDto.bank_details) {
      updateData['bank_details'] = profileDto.bank_details;
    }
    if (profileDto.driving_card) {
      updateData['driving_card'] = profileDto.driving_card;
    }
    if (profileDto.vehicle_no) {
      updateData['vehicle_no'] = profileDto.vehicle_no;
    }
    if (profileDto.vehicle_type) {
      updateData['vehicle_type'] = profileDto.vehicle_type;
    }
    if (profileDto.store_license) {
      updateData['store_license'] = profileDto.store_license;
    }
    if (profileDto.store_license_image) {
      updateData['store_license_image'] = profileDto.store_license_image;
    }
    if (profileDto.food_license) {
      updateData['food_license'] = profileDto.food_license;
    }
    if (profileDto.food_license_image) {
      updateData['food_license_image'] = profileDto.food_license_image;
    }
    if (profileDto.services_area) {
      updateData['services_area'] = profileDto.services_area;
    }
    if (profileDto.profile_photo) {
      updateData['profile_photo'] = profileDto.profile_photo;
      updateData['profilePhoto'] = profileDto.profile_photo;
    }
    if (profileDto.vehicle_image) {
      updateData['vehicle_image'] = profileDto.vehicle_image;
    }
    if (profileDto.store_image) {
      updateData['store_image'] = profileDto.store_image;
    }
    if (profileDto.aadhar_card_image) {
      updateData['aadhar_card_image'] = profileDto.aadhar_card_image;
    }
    if (profileDto.driving_card_image) {
      updateData['driving_card_image'] = profileDto.driving_card_image;
    }
    if (profileDto.pan_card_image) {
      updateData['pan_card_image'] = profileDto.pan_card_image;
    }
    if (profileDto.partnerId) {
      updateData['partnerId'] = profileDto.partnerId;
    }

    await this.UserDataModel.updateOne(
      {
        userId: ObjectId(id),
      },
      {
        $set: updateData,
      },
      {
        upsert: true,
      },
    );

    if (profileDto.email) {
      updateUser['email'] = profileDto.email;
    }
    if (profileDto.emailVerified) {
      updateUser['emailVerified'] = profileDto.emailVerified;
    }
    if (profileDto.address) {
      updateUser['address'] = profileDto.address;
    }
    if (profileDto.phoneNumber) {
      updateUser['phoneNumber'] = profileDto.phoneNumber;
    }
    if (profileDto.verifyType) {
      updateUser['verifyType'] = profileDto.verifyType;
    }
    if (profileDto.liveStatus) {
      updateUser['liveStatus'] = profileDto.liveStatus;
    }
    if (profileDto.phoneVerified) {
      updateUser['phoneVerified'] = profileDto.phoneVerified;
    }
    if (profileDto.permissions) {
      updateUser['permissions'] = profileDto.permissions;
    }
    if (profileDto.loc) {
      updateUser['loc'] = profileDto.loc;
    }
    if (profileDto.activeStatus) {
      updateUser['activeStatus'] = profileDto.activeStatus;
    }
    if (profileDto.verifyStatus) {
      updateUser['verifyStatus'] = profileDto.verifyStatus;
    }
    console.log(id)
    console.log(await this.UserDataModel.updateOne(
      {
        _id: ObjectId(id),
      },
      {
        $set: updateData,
      },
      {
        upsert: true,
      },
    ));

    var userData = await this.UserDataModel.findOne({
      userId: ObjectId(id),
    });
    var user = JSON.parse(
      JSON.stringify(await this.usersgetModel.findById(id)),
    );
    user['userData'] = userData;

    return user;
  }
}
