import { Injectable, BadRequestException } from '@nestjs/common';
import { Settings } from './settings.model';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateSettingsDto } from './dto/create-settings';
import { EditSettingsDto } from './dto/edit-settings';
import { v5 as uuidv5 } from 'uuid';
import { ConfigService } from 'src/core/config/config.service';
import { SendEmailMiddleware } from './../core/middleware/send-email.middleware';
import { UseRoles } from 'nest-access-control';
@Injectable()
export class SettingsService {
    constructor(
        private configService:ConfigService,
        private sendEmailMiddleware: SendEmailMiddleware,
        @InjectModel('Settings') private SettingsModel: Model<Settings>
    ){

    }
    
    async getAllCustomers(user:any)
    {
      return  this.SettingsModel.find({});  
    }
    async getCategoryDetail (id:any)
    {
      return  this.SettingsModel.findById(id);  
    }  
    async updateCategory(id:string,securityDto:CreateSettingsDto,user:any)
    {
        return this.SettingsModel.findOne({_id:id}).then((data)=>{
            data.column_value = securityDto.column_value;
            data.column_key =securityDto.column_key;
            data.modifiedBy = user._id;
            data.save();
            return data.toObject({ versionKey: false });
        },error=>{
            let msg='Invalid Request!';
            if(error.errmsg) msg=error.errmsg
            return new BadRequestException(msg);
        });
    }
    async createCategory(securityDto:CreateSettingsDto,user:any)
    {
        
        const newUser = new this.SettingsModel({
            column_value:securityDto.column_value,
            column_key:securityDto.column_key,
            createdBy:user._id,
            modifiedBy : user._id
          
        });
        return await newUser.save().then((user:any) => {
            
            return user.toObject({ versionKey: false });
        },error=>{
            let msg='Invalid Request!';
            if(error.errmsg) msg=error.errmsg
            return new BadRequestException(msg);
        });
    }
    async deleteSettings(id:string): Promise<any> {
        return await this.SettingsModel.findByIdAndRemove(id);
    }
}
