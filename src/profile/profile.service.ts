import { Injectable, BadRequestException } from '@nestjs/common';
import { Profile } from './profile.model';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateProfileDto } from './dto/create-profile';
import { EditProfileDto } from './dto/edit-profile';
import { v5 as uuidv5 } from 'uuid';
import { ConfigService } from 'src/core/config/config.service';
import { SendEmailMiddleware } from '../core/middleware/send-email.middleware';
import { UseRoles } from 'nest-access-control';
@Injectable()
export class ProfileService {
    constructor(
        private configService: ConfigService,
        private sendEmailMiddleware: SendEmailMiddleware,
        @InjectModel('Profile') private ProfileModel: Model<Profile>

    ) {

    }

    async getAllProfile(user: any) {
        return this.ProfileModel.find({}).populate('userId');
    }
    async getProfileDetail(id: any) {
        return this.ProfileModel.findById(id).populate('userId');
    }
    async updateProfile(id: string, files:any,profileDto: any, user: any) {

        if (user.role == "MERCHANT") {

            return this.ProfileModel.findById({ _id: id }).then((data) => {

                    data.gender = profileDto.gender;
                    data.fullName = profileDto.fullName;
                    data.dob = profileDto.dob;
                    data.shop_name = profileDto.shop_name;
                    data.shop_address = profileDto.shop_address;
                    data.sell_items = profileDto.sell_items;
                    data.adharcard_no = profileDto.adharcard_no;
                    data.pancard_no = profileDto.pancard_no;
                    data.gst_no = profileDto.gst_no;
                    if(files.profile_photo)
                    data.profile_photo= files.profile_photo;
                    if(files.store_license_image)
                    data.store_license_image= files.store_license_image;
                    if(files.aadhar_card_image)
                    data.aadhar_card_image= files.aadhar_card_image;
                    if(files.pan_card_image)
                    data.pan_card_image= files.pan_card_image;
                    data.bank_details ={
                        bank_account_holer_name:profileDto.bank_account_holer_name,
                        bank_account_no: profileDto.bank_account_no,
                        bank_name:profileDto.bank_name,
                        ifsc_code:profileDto.ifsc_code
                    }
                    data.store_license_image = files.store_license;
                    data.modifiedBy = user._id,
                    data.save();

                return data.toObject({ versionKey: false });

            }, error => {
                let msg = 'Invalid Request!';
                if (error.errmsg) msg = error.errmsg
                return new BadRequestException(msg);


            });
        }
        else {
            return this.ProfileModel.findById({ _id: id }).then((data) => {
                data.gender = profileDto.gender;
                data.dob = profileDto.dob;
                data.fullName = profileDto.fullName;
                data.vehicle_no = profileDto.vehicle_no;
                data.adharcard_no = profileDto.adharcard_no;
                data.pancard_no = profileDto.pancard_no;
                data.driving_card = profileDto.driving_card;
                data.vehicle_type = profileDto.vehicle_type;
                    if(files.profile_photo)
                    data.profile_photo= files.profile_photo;
                    if(files.vehicle_image)
                    data.vehicle_image= files.vehicle_image;
                    if(files.aadhar_card_image)
                    data.aadhar_card_image= files.aadhar_card_image;
                    if(files.driving_card_image)
                    data.driving_card_image= files.driving_card_image;
                    if(files.pan_card_image)
                    data.pan_card_image= files.pan_card_image;
                data.modifiedBy = user._id,
                data.save();
                  return data.toObject({ versionKey: false });
            }, error => {
                let msg = 'Invalid Request!';
                if (error.errmsg) msg = error.errmsg
                return new BadRequestException(msg);


            });

        }

    }


    async createProfile(files: any, profileDto: any, user: any) {

        const newProfile = new this.ProfileModel(profileDto);
        return await newProfile.save().then((user: any) => {
               return user.toObject({ versionKey: false });
        }, error => {
            let msg = 'Invalid Request!';
            if (error.errmsg) msg = error.errmsg
            return new BadRequestException(msg);
        });
    }

    async deleteProfile(id: string): Promise<any> {
        return await this.ProfileModel.findByIdAndRemove(id);
    }
}
