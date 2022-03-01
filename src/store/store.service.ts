import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { catalogue } from 'src/catalogue/catalogue.model';
import { User } from '../auth/user.model';
import { UserData } from '../user-data/user-data.model';
let ObjectId = require('mongodb').ObjectId;
@Injectable()
export class StoreService {
  constructor(
    @InjectModel('User') private userModel: Model<User>,
    @InjectModel('UserData') private userDataModel: Model<UserData>,
    @InjectModel('catalogue') private catalogueModel: Model<catalogue>,
  ) {}
  async getAllStore() {
    const store = JSON.parse(
      JSON.stringify(
        await this.userDataModel.aggregate([
          {
            $lookup: {
              from: 'users',
              localField: 'userId',
              foreignField: '_id',
              as: 'user',
            },
          },
          {
            $lookup: {
              from: 'users',
              localField: 'delegate_access',
              foreignField: '_id',
              as: 'delegate_users',
            },
          },
          {
            $lookup: {
              from: 'categories',
              localField: 'categoryId',
              foreignField: '_id',
              as: 'categories',
            },
          },
        ]),
      ),
    );

    for (let i = 0; i < store.length; i++) {
      store[i]['products'] = await this.catalogueModel
        .find({
          storeId: ObjectId(store[i]._id),
        })
        .count();
    }

    return store;
  }

  async getStore(id: string) {
    const store = JSON.parse(
      JSON.stringify(
        await this.userDataModel.aggregate([
          { $match: { _id: new ObjectId(id) } },
          {
            $lookup: {
              from: 'users',
              localField: 'userId',
              foreignField: '_id',
              as: 'user',
            },
          },
          {
            $lookup: {
              from: 'users',
              localField: 'delegate_access',
              foreignField: '_id',
              as: 'delegate_users',
            },
          },
          {
            $lookup: {
              from: 'categories',
              localField: 'categoryId',
              foreignField: '_id',
              as: 'categories',
            },
          },
        ]),
      ),
    );
    for (let i = 0; i < store.length; i++) {
      store[i]['products'] = await this.catalogueModel
        .find({
          storeId: ObjectId(store[i]._id),
        })
        .count();
    }

    return store;
  }

  async postStore(files: any, storeDto: any) {
    let usersCount = (await this.userModel.estimatedDocumentCount()) + 1;
    let today = new Date().toISOString().substr(0, 10);
    let todayDate = today.replace(/-/g, '');

    let userId = todayDate + usersCount;

    const userCollection = {
      profilePhoto: files.merchant_profilePic[0].path,
      fullName: storeDto.body.merchant_name,
      role: 'MERCHANT',
      gender: storeDto.body.merchant_gender,
      dateofbirth: storeDto.body.merchant_dateOfBirth,
      address: storeDto.body.merchant_Address,
      phoneNumber: storeDto.body.merchant_phoneNumber,
      userId: userId,
      password: Math.floor(Math.random() * 1000000000).toString(),
    };

    const user = await new this.userModel(userCollection).save();

    let delegate_access = [];
    if (storeDto.body.delegate_access) {
      storeDto.body.delegate_access = storeDto.body.delegate_access.split(',');
      const count = storeDto.body.delegate_access.length;
      for (let i = 0; i < count; i++) {
        usersCount = (await this.userModel.estimatedDocumentCount()) + 1;
        today = new Date().toISOString().substr(0, 10);
        todayDate = today.replace(/-/g, '');

        userId = todayDate + usersCount;
        const delegateUser = {
          role: 'SUPPORT',
          phoneNumber: storeDto.body.delegate_access[i],
          userId: userId,
          password: Math.floor(Math.random() * 1000000000).toString(),
        };

        const delegateUserData = await new this.userModel(delegateUser).save();
        delegate_access.push(delegateUserData._id);
      }
    }

    const storeCollection = {
      userId: user._id,
      profile_type: 'Store',
      shop_name: storeDto.body.shopName,
      shop_address: storeDto.body.shopAddress,
      shop_Lat_Long: storeDto.body.shop_Lat_Long.split(','),
      categoryId: storeDto.body.category,
      gst_no: storeDto.body.gst_no,
      services_area: storeDto.body.service_area_zipcode.split(','),
      bank_details: {
        bank_account_no: storeDto.body.bank_account_no,
        bank_account_holer_name: storeDto.body.bank_account_holder_name,
        bank_name: storeDto.body.bank_name,
        ifsc_code: storeDto.body.ifsc_code,
      },
      delegate_access: delegate_access,
      primary_language: storeDto.body.primary_language,
      secondary_language: storeDto.body.secondary_language,
      store_timing: storeDto.body.store_timing,
    };

    if (files.storeImage) {
      storeCollection['storeImage'] = files.storeImage[0].path;
    }

    if (files.aadhar_card_pic && storeDto.body.aadhar_card_number) {
      storeCollection['aadhar_card_image'] = files.aadhar_card_pic[0].path;
      storeCollection['adharcard_no'] = storeDto.body.aadhar_card_number;
    }

    if (files.pan_card_pic && storeDto.body.pan_card_number) {
      storeCollection['pan_card_image'] = files.pan_card_pic[0].path;
      storeCollection['pancard_no'] = storeDto.body.pan_card_number;
    }

    if (files.store_licences_pic && storeDto.body.store_licences_number) {
      storeCollection['store_license_image'] = files.store_licences_pic[0].path;
      storeCollection['store_license'] = storeDto.body.store_licences_number;
    }

    if (files.licences_pic && storeDto.body.licences_number) {
      storeCollection['license_image'] = files.licences_pic[0].path;
      storeCollection['license'] = storeDto.body.licences_number;
    }

    const store = await new this.userDataModel(storeCollection).save();

    return store;
  }
}
