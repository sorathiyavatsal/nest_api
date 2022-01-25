import { Injectable, BadRequestException } from '@nestjs/common';
import { Coupons } from './coupons.schema';
import { InjectModel } from '@nestjs/mongoose';
import * as randomstring from 'randomstring'
import { Model } from 'mongoose';
@Injectable()
export class CouponsService {
  constructor(@InjectModel('Coupons') private CouponsSchema: Model<Coupons>) {}

  async getAllCoupons(user: any) {
    return this.CouponsSchema.find({});
  }
  async getCouponbyId(id: any, user: any) {
    return this.CouponsSchema.findOne({});
  }
  async updateCoupon(id: string, securityDto: any, user: any) {
    return this.CouponsSchema.updateOne({ _id: id }).then(
      data => {
        data.req.body

      
        return data.toObject({});
      },
      error => {
        let msg = 'Invalid Request!';
        if (error.errmsg) msg = error.errmsg;
        return new BadRequestException(msg);
      },
    );
  }
  async createCoupon(securityDto: any, user: any) {
    const coupon = randomstring.generate(7);
    const newPromo = new this.CouponsSchema({
      coupoun_name: securityDto.name, 
      coupoun_code:coupon, 
     createdBy: user._id,
      modifiedBy: user._id,
    });
    console.log(securityDto);
    return await newPromo.save().then(
      (user: any) => {
        return user.toObject({ versionKey: false });
      },
      error => {
        let msg = 'Invalid Request!';
        if (error.errmsg) msg = error.errmsg;
        console.log(error);
        return new BadRequestException(msg);
      },
    );
  }
 
  async deleteCoupon(id: string, securityDto: any, user: any) {
    return this.CouponsSchema.updateOne({ _id: id }).then(
      data => {
        data.req.body

      
        return data.toObject({});
      },
      error => {
        let msg = 'Invalid Request!';
        if (error.errmsg) msg = error.errmsg;
        return new BadRequestException(msg);
      },
    );
  }

}
