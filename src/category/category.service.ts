import { Injectable, BadRequestException } from '@nestjs/common';
import { Security } from './security.model';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateCustomerDto } from './dto/create-customer';
import { EditCustomerDto } from './dto/edit-customer';
import { v5 as uuidv5 } from 'uuid';
import { ConfigService } from 'src/core/config/config.service';
import { SendEmailMiddleware } from './../core/middleware/send-email.middleware';
import { UseRoles } from 'nest-access-control';
@Injectable()
export class CustomerService {
    constructor(
        private configService:ConfigService,
        private sendEmailMiddleware: SendEmailMiddleware,
        @InjectModel('Security') private CustomerModel: Model<Security>
    ){

    }
    
    async validateApiKey(key:string)
    {
      return await this.securityModel.findOne({apiKey:key,activeStatus:true});  
    }
    async getAllCustomers(user:any)
    {
      return  this.securityModel.find({});  
    }
    
    
    async updateAPIUser(id:string,securityDto:EditSecurityDto,user:any)
    {
        return this.securityModel.findOne({_id:id}).then((data)=>{
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
    async createAPIUser(securityDto:CreateSecurityDto,user:any)
    {
        const MY_NAMESPACE = securityDto.name;
        let apiKey:any = await this.configService.letterValue(MY_NAMESPACE);
       
        const newUser = new this.securityModel({
            apiKey:apiKey,
            email: securityDto.email,
            name: securityDto.name,
            createdBy:user._id,
            modifiedBy : user._id,
            activeStatus: securityDto.activeStatus
           
        });
        return await newUser.save().then((user:any) => {
            let registerEmail:any={
                
                to:user.email,
                subject:'API Access Key',
                template:'./security',
                context:{
                    apikey:user.apiKey
                }

            }
            this.sendEmailMiddleware.sendEmailAll(registerEmail);
            return user.toObject({ versionKey: false });
        },error=>{
            let msg='Invalid Request!';
            if(error.errmsg) msg=error.errmsg
            return new BadRequestException(msg);
        });
    }
}
