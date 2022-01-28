import { Injectable, BadRequestException } from '@nestjs/common';
import { Coupons } from './coupons.schema';
import { InjectModel } from '@nestjs/mongoose';
import * as randomstring from 'randomstring';
import { Model } from 'mongoose';
import { request } from 'http';
@Injectable()
export class CouponsService {
  constructor(@InjectModel('Coupons') private CouponsSchema: Model<Coupons>) {}

  async getAllCoupons(user: any) {
    return this.CouponsSchema.find({});
  }
  async getCouponbyId(id: any, user: any) {
    return this.CouponsSchema.findOne({});
  }
  async updateCoupon(_id: string, couponDto: any, user: any) {
    let uniqueId = { _id };
    let updateBody = couponDto;
    console.log(uniqueId);
    console.log(updateBody);
    return await this.CouponsSchema.updateOne(uniqueId, updateBody);
  }

  async createCoupon(securityDto: any, user: any) {
    const coupon = randomstring.generate(7);
    const newPromo = new this.CouponsSchema({
      coupoun_name: securityDto.name,
      coupoun_code: coupon,
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

  async deleteCoupon(_id: string) {
    let uniqueId = { _id };

    console.log(uniqueId);

    return await this.CouponsSchema.deleteOne(uniqueId);
  }
}
