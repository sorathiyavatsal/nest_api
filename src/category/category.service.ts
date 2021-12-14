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
import { WeightsSchema } from 'src/weight/weight.model';
import { PackagesSchema } from 'src/packages/packages.model';

@Injectable()
export class CategoryService {
    constructor(
        private configService:ConfigService,
        private sendEmailMiddleware: SendEmailMiddleware,
        @InjectModel('Category') private CategoryModel: Model<Category>,
        @InjectModel('Weights') private WeightModel: Model<Category>,
        @InjectModel('Packages') private PackageModel: Model<Category>,

    ){
   
    }
    async getActiveCategory(user:any)
    {
       let categorys:any=await this.CategoryModel.find({activeStatus:true});
    
       let results:any=[];
        for(let i=0;i<categorys.length;i++){
            let element=categorys[i]
            let extGet=["jpg","png"]
            let filename='d';
            if(element.name)
             filename=element.name+".png";
            if(element.image && element.image.path)
            filename=element.image.path;
            let weights:any=await this.WeightModel.aggregate([{"$match":{category:element._id}},{"$group":{_id:"category",max_weight:{$max:"$to_weight"}}}]).limit(1)
            let packs:any=await this.PackageModel.aggregate([{"$match":{category:element._id}},{"$group":{_id:"category",max_pack:{$max:"$to_pack"}}}]).limit(1)
            element.image={max_weight:weights,max_pack:packs,path:this.configService.get('WEB_APP_URI')+filename}
            results.push(element)
        }
        return categorys;
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
