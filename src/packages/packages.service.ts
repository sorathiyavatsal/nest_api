import { Injectable, BadRequestException } from '@nestjs/common';
import { Packages } from './packages.model';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreatePackagesDto } from './dto/create-packages';
import { EditPackagesDto } from './dto/edit-packages';
import { v5 as uuidv5 } from 'uuid';
import { ConfigService } from 'src/core/config/config.service';
import { SendEmailMiddleware } from '../core/middleware/send-email.middleware';
@Injectable()
export class PackageService {
    constructor(
        private configService:ConfigService,
        private sendEmailMiddleware: SendEmailMiddleware,
        @InjectModel('Packages') private PackagesModel: Model<Packages>
    ){

    }
    
    async getAllPackages(user:any)
    {
      return this.PackagesModel.find({}).populate('category', 'name');  
    }
    async getPackgesDetail(id:any)
    {
      return  this.PackagesModel.findById(id);  
    }  
    async updatePackages(id:string,packagesDto:EditPackagesDto,user:any)
    {
        return this.PackagesModel.findById({_id:id}).then((data)=>{
            
            data.from_pack = packagesDto.from_pack;
            data.to_pack = packagesDto.to_pack;
            data.rate = packagesDto.rate;
            data.category = packagesDto.category;
            data.activeStatus = packagesDto.activeStatus;
            data.modifiedBy = user._id
            data.save();
            return data.toObject({ versionKey: false });
        },error=>{
            let msg='Invalid Request!';
            if(error.errmsg) msg=error.errmsg
            return new BadRequestException(msg);
        });
    }
    async createPackages(packagesDto:CreatePackagesDto,user:any)
    {
        
        const newUser = new this.PackagesModel(packagesDto);
        return await newUser.save().then((user:any) => {
            
            return user.toObject({ versionKey: false });
        },error=>{
            let msg='Invalid Request!';
            if(error.errmsg) msg=error.errmsg
            return new BadRequestException(msg);
        });
    }

    async deletePackages(id:string): Promise<any> {
        return await this.PackagesModel.findByIdAndRemove(id);
    }
}
