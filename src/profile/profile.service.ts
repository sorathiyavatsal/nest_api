import { Injectable, BadRequestException } from '@nestjs/common';
import { Profile } from './profile.model';
import { ProfileDeliveryBoy } from './profile-deliveryboy.model';
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
        private configService:ConfigService,
        private sendEmailMiddleware: SendEmailMiddleware,
        @InjectModel('Profile') private ProfileModel: Model<Profile>,
        @InjectModel('ProfileDeliveryBoy') private ProfileDeliveryBoyModel: Model<ProfileDeliveryBoy>
    ){

    }
    
    async getAllProfile(user:any)
    {
      return  this.ProfileModel.find({});  
    }
    async getProfileDetail(id:any)
    {
      return  this.ProfileModel.findById(id);  
    }  
    async updateProfile(id:string,profileDto:EditProfileDto,user:any,)
    {

        if(user.role == "MERCHANT"){

            return this.ProfileModel.findById({_id:id}).then((data)=>{

                data.gender = profileDto.gender,
                data.dob = profileDto.dob,
                data.shop_name = profileDto.shop_name,
                data.shop_address =  profileDto.shop_address,
                data.sell_items = profileDto.sell_items,
                data.adharcard_no = profileDto.adharcard_no,
                data.pancard_no = profileDto.pancard_no,
                data.gst_no = profileDto.gst_no,
                data.bank_account_holer_name = profileDto.bank_account_holer_name,
                data.bank_account_no = profileDto.bank_account_no,
                data.bank_name = profileDto.bank_name,
                data.ifsc_code = profileDto. ifsc_code,
                data.modifiedBy = user._id,
                data.save();
    
                return data.toObject({ versionKey: false });

            },error=>{
                let msg='Invalid Request!';
                if(error.errmsg) msg=error.errmsg
                return new BadRequestException(msg);
                
    
        });
    }
        else{
            return this.ProfileDeliveryBoyModel.findById({_id:id}).then((data)=>{

                
    
                return data.toObject({ versionKey: false });
            },error=>{
                let msg='Invalid Request!';
                if(error.errmsg) msg=error.errmsg
                return new BadRequestException(msg);
                
    
        });

        }
        
    }

    
    async createProfile(profileDto:CreateProfileDto,user:any)
    {
        
        const newProfile = new this.ProfileModel(profileDto);
        return await newProfile.save().then((user:any) => {
            
            return user.toObject({ versionKey: false });
        },error=>{
            let msg='Invalid Request!';
            if(error.errmsg) msg=error.errmsg
            return new BadRequestException(msg);
        });
    }

    async deleteProfile(id:string): Promise<any> {
        return await this.ProfileModel.findByIdAndRemove(id);
    }
}
