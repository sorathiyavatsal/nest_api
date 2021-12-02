import { Injectable, BadRequestException } from '@nestjs/common';
import { Category } from './category.model';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateCategoryDto } from './dto/create-category';
import { EditCategoryDto } from './dto/edit-category';
import { v5 as uuidv5 } from 'uuid';
import { ConfigService } from 'src/core/config/config.service';
import { SendEmailMiddleware } from './../core/middleware/send-email.middleware';
import { UseRoles } from 'nest-access-control';
@Injectable()
export class CategoryService {
    constructor(
        private configService:ConfigService,
        private sendEmailMiddleware: SendEmailMiddleware,
        @InjectModel('Category') private CategoryModel: Model<Category>
    ){

    }
    
    async getAllCategory(user:any)
    {
      return  this.CategoryModel.find({});  
    }
    async getCategoryDetail (id:any)
    {
      return  this.CategoryModel.findById(id);  
    }  
    async updateCategory(id:string,securityDto:any,user:any)
    {
           return this.CategoryModel.findOne({_id:id}).then((data)=>{
            data.name=securityDto.name
            data.activeStatus= securityDto.activeStatus
            data.modifiedBy = user._id
           
            data.save();
            return data.toObject({ versionKey: false });
        },error=>{
            let msg='Invalid Request!';
            if(error.errmsg) msg=error.errmsg
            return new BadRequestException(msg);
        });
    }
    async createCategory(securityDto:any,user:any)
    {
        
        const newUser = new this.CategoryModel({
            
            image: securityDto.image,
            name: securityDto.name,
            createdBy:user._id,
            modifiedBy : user._id,
            activeStatus: securityDto.activeStatus
           
        });
        return await newUser.save().then((user:any) => {
            
            return user.toObject({ versionKey: false });
        },error=>{
            let msg='Invalid Request!';
            if(error.errmsg) msg=error.errmsg
            return new BadRequestException(msg);
        });
    }
}
