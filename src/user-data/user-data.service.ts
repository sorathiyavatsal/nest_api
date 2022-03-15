import { Injectable, BadRequestException } from '@nestjs/common';
import { UserData } from './user-data.model';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from 'src/auth/user.model';
let ObjectId = require('mongodb').ObjectId;

@Injectable()
export class UserDataService {
  constructor(
    @InjectModel('UserData') private UserDataModel: Model<UserData>,
    @InjectModel('User') private UserModel: Model<User>,
  ) {}

  async getAllProfile(user: any) {
    return this.UserDataModel.find({}).populate('userId');
  }

  async getProfileDetail(id: any) {
    return this.UserDataModel.findById(id).populate('userId');
  }

  async updateProfile(id: string, files: any, profileDto: any, user: any) {
    if (user.user.role == 'MERCHANT') {
      return this.UserDataModel.findById({ _id: id }).then(
        (data) => {
          data.gender = profileDto.gender;
          data.fullName = profileDto.fullName;
          data.dob = profileDto.dob;
          data.shop_name = profileDto.shop_name;
          data.shop_address = profileDto.shop_address;
          data.shop_located_at = profileDto.shop_located_at;
          data.sell_items = profileDto.sell_items;
          data.adharcard_no = profileDto.adharcard_no;
          data.pancard_no = profileDto.pancard_no;
          data.gst_no = profileDto.gst_no;
          if (files?.profile_photo) data.profile_photo = files.profile_photo;
          if (files?.store_license_image)
            data.store_license_image = files.store_license_image;
          if (files?.aadhar_card_image)
            data.aadhar_card_image = files.aadhar_card_image;
          if (files?.pan_card_image) data.pan_card_image = files.pan_card_image;
          data.bank_details = {
            bank_account_holer_name: profileDto.bank_details.bank_account_holer_name,
            bank_account_no: profileDto.bank_details.bank_account_no,
            bank_name: profileDto.bank_details.bank_name,
            ifsc_code: profileDto.bank_details.ifsc_code,
          };
          data.store_license_image = files.store_license;
          data.modifiedBy = user._id;
          data.save();

          return data.toObject({ versionKey: false });
        },
        (error) => {
          let msg = 'Invalid Request!';
          if (error.errmsg) msg = error.errmsg;
          return new BadRequestException(msg);
        },
      );
    } else {
      return this.UserDataModel.findById({ _id: id }).then(
        (data) => {
          data.gender = profileDto.gender;
          data.dob = profileDto.dob;
          data.fullName = profileDto.fullName;
          data.vehicle_no = profileDto.vehicle_no;
          data.adharcard_no = profileDto.adharcard_no;
          data.pancard_no = profileDto.pancard_no;
          data.driving_card = profileDto.driving_card;
          data.vehicle_type = profileDto.vehicle_type;
          if (files?.profile_photo) data.profile_photo = files.profile_photo;
          if (files?.vehicle_image) data.vehicle_image = files.vehicle_image;
          if (files?.aadhar_card_image)
            data.aadhar_card_image = files.aadhar_card_image;
          if (files?.driving_card_image)
            data.driving_card_image = files.driving_card_image;
          if (files?.pan_card_image) data.pan_card_image = files.pan_card_image;
          data.modifiedBy = user._id;
          data.save();
          return data.toObject({ versionKey: false });
        },
        (error) => {
          let msg = 'Invalid Request!';
          if (error.errmsg) msg = error.errmsg;
          return new BadRequestException(msg);
        },
      );
    }
  }

  async createProfile(files: any, profileDto: any, user: any) {
    let data: any = { userId: profileDto.userId };
    let userProfile: any = await this.UserDataModel.findOne({
      userId: new ObjectId(data.userId),
    });
    if (userProfile && userProfile._id) {
      return new BadRequestException('Profile is already created');
    }
    const userData = await this.UserModel.findOne({_id: new ObjectId(data.userId)});
    if (userData.role == 'MERCHANT') {
      data.profile_type = 'User';
      data.gender = profileDto.gender;
      data.fullName = profileDto.fullName;
      data.dob = profileDto.dob;
      data.shop_name = profileDto.shop_name;
      data.shop_address = profileDto.shop_address;
      data.shop_located_at = profileDto.shop_located_at;
      data.sell_items = profileDto.sell_items;
      data.adharcard_no = profileDto.adharcard_no;
      data.pancard_no = profileDto.pancard_no;
      data.gst_no = profileDto.gst_no;
      data.gst_image = profileDto.gst_image;
      data.food_license = profileDto.food_license;
      if(files?.food_license_image) data.food_license_image = files.food_license_image; 
      if (files?.profile_photo) data.profile_photo = files.profile_photo[0];
      if (files?.store_license_image)
        data.store_license_image = files.store_license_image;
      if (files?.aadhar_card_image)
        data.aadhar_card_image = files.aadhar_card_image;
      if (files?.pan_card_image) data.pan_card_image = files.pan_card_image;
      data.bank_details = {
        bank_account_holer_name: profileDto.bank_details.bank_account_holer_name,
        bank_account_no: profileDto.bank_details.bank_account_no,
        bank_name: profileDto.bank_details.bank_name,
        ifsc_code: profileDto.bank_details.ifsc_code,
      };
      if(files?.store_image) data.store_image = files.store_image
      data.store_license_image = files?.store_license;
      data.modifiedBy = user.user._id;
      data.createdBy = user.user._id;
      data.services_area = profileDto.services_area || [];
    }
    if (userData.role == 'DELIVERY') {
      data.profile_type = 'User';
      data.gender = profileDto.gender;
      data.dob = profileDto.dob;
      data.fullName = profileDto.fullName;
      data.vehicle_no = profileDto.vehicle_no;
      data.adharcard_no = profileDto.adharcard_no;
      data.pancard_no = profileDto.pancard_no;
      data.driving_card = profileDto.driving_card;
      data.vehicle_type = profileDto.vehicle_type;
      data.job_type = profileDto.job_type;
      if (files?.profile_photo) data.profile_photo = files.profile_photo[0];
      if (files?.vehicle_image) data.vehicle_image = files.vehicle_image;
      if (files?.aadhar_card_image)
        data.aadhar_card_image = files.aadhar_card_image;
      if (files?.driving_card_image)
        data.driving_card_image = files.driving_card_image;
      if (files?.pan_card_image) data.pan_card_image = files.pan_card_image;
      data.modifiedBy = user.user._id;
      data.createdBy = user.user._id;
      data.partnerId = profileDto.partnerId;
      data.bank_details = {
        bank_account_holer_name: profileDto.bank_details.bank_account_holer_name,
        bank_account_no: profileDto.bank_details.bank_account_no,
        bank_name: profileDto.bank_details.bank_name,
        ifsc_code: profileDto.bank_details.ifsc_code,
      };
      data.services_area = profileDto.services_area || [];
    }
    if(userData.role == 'PARTNER'){
      data.profile_type = 'User';
      data.gender = profileDto.gender;
      data.fullName = profileDto.fullName;
      data.dob = profileDto.dob;
      data.shop_name = profileDto.shop_name;
      data.shop_address = profileDto.shop_address;
      data.adharcard_no = profileDto.adharcard_no;
      data.pancard_no = profileDto.pancard_no;
      data.gst_no = profileDto.gst_no;
      if (files?.profile_photo) data.profile_photo = files.profile_photo[0];
      if (files?.store_license_image)
        data.store_license_image = files.store_license_image;
      if (files?.aadhar_card_image)
        data.aadhar_card_image = files.aadhar_card_image;
      if (files?.pan_card_image) data.pan_card_image = files.pan_card_image;
      data.bank_details = {
        bank_account_holer_name: profileDto.bank_details.bank_account_holer_name,
        bank_account_no: profileDto.bank_details.bank_account_no,
        bank_name: profileDto.bank_details.bank_name,
        ifsc_code: profileDto.bank_details.ifsc_code,
      };
      data.modifiedBy = user.user._id;
      data.createdBy = user.user._id;
      data.services_area = profileDto.services_area || [];
    }
    
    let newProfile = new this.UserDataModel(data);
    return await newProfile.save().then(
      (user: any) => {
        return user.toObject({ versionKey: false });
      },
      (error) => {
        console.log(error);
        let msg = 'Invalid Request!';
        if (error.errmsg) msg = error.errmsg;
        return new BadRequestException(msg);
      },
    );
  }

  async deleteProfile(id: string): Promise<any> {
    return await this.UserDataModel.findByIdAndRemove(id);
  }
}
