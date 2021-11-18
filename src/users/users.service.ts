import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User} from '../auth/user.model';
@Injectable()
export class UsersService {
    user:any;
    constructor(
        @InjectModel('User') private usersgetModel: Model<User>
    ){

    }
    async findOneId(id:string)
    {
        return await this.usersgetModel.findOne({_id:id});
    }
    async findOneByEmail(email:string)
    {
        return await this.usersgetModel.findOne({email:email});
    }
    async getAllUsers() {
        return await this.usersgetModel.find();
     }
}
