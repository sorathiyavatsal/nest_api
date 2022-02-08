import { Injectable, BadRequestException } from '@nestjs/common';
import { Role } from './role.model';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateRoleDto } from './dto/create-role';
import { EditRoleDto } from './dto/edit-role';
import { v5 as uuidv5 } from 'uuid';
import { ConfigService } from 'src/core/config/config.service';
import { SendEmailMiddleware } from '../core/middleware/send-email.middleware';
@Injectable()
export class RoleService {
    constructor(
        private configService:ConfigService,
        private sendEmailMiddleware: SendEmailMiddleware,
        @InjectModel('Role') private RoleModel: Model<Role>
    ){

    }
    
    async getAllRole(user:any)
    {
      return  this.RoleModel.find({});  
    }
    async getRoleDetail(id:any)
    {
      return  this.RoleModel.findById(id);  
    }  
    async updateRole(id:string,RoleDto:EditRoleDto,user:any)
    {
        return this.RoleModel.findById({_id:id}).then((data)=>{
            

    });
    }

    
    async createRole(RoleDto:CreateRoleDto,user:any)
    {
        
        const newRole = new this.RoleModel(RoleDto);
        return await newRole.save().then((user:any) => {
            
            return user.toObject({ versionKey: false });
        },error=>{
            let msg='Invalid Request!';
            if(error.errmsg) msg=error.errmsg
            return new BadRequestException(msg);
        });
    }

    async deleteRole(id:string): Promise<any> {
        return await this.RoleModel.findByIdAndRemove(id);
    }
}
