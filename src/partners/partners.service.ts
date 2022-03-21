import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { UserData } from 'src/user-data/user-data.model';
import { User } from 'src/auth/user.model';
let ObjectId = require('mongodb').ObjectId;
@Injectable()
export class PartnersService {

  constructor(
    @InjectModel('Users') private UsersModel: Model<User>,
    @InjectModel('UserData') private UserDataModel: Model<UserData>,
  ) { }

  async getAllPartners() {
    
    var partners = JSON.parse(JSON.stringify(await this.UsersModel.find({
        "role": "PARTNER"
    })))

    for(let i = 0; i < partners.length; i++) {
        const partnersCount = await this.UserDataModel.find({
            partnerId: ObjectId(partners[i]._id)
        });

        const userData = await this.UserDataModel.find({
            userId: ObjectId(partners[i]._id)
        });

        partners[i]["userData"] = userData[0]
        partners[i]["DA"] = partnersCount.length
    }

    return partners
  }
}
