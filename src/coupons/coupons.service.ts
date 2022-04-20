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
    return await this.CouponsSchema.updateOne(uniqueId, updateBody);
  }

  async createCoupon(securityDto: any, user: any) {
    const coupon = randomstring.generate(7);
    const coupon_details = { 
      coupoun_name: securityDto.name,
      coupoun_code: securityDto.coupon_code!=""? securityDto.coupon_code : coupon,
      coupon_usablenumber: securityDto.coupon_usablenumber,
      coupon_expiration: securityDto.coupon_expiration,
      discount_type: securityDto.discount_type,
      discount_amount: securityDto.discount_amount,
      coupon_conditional: securityDto.coupon_conditional,
      coupon_condition_percent:  securityDto.coupon_conditional && securityDto.discount_type?{
        min_cart_value: securityDto.min_cart_value,
        max_discount_limit: securityDto.max_discount_limit,
      }:null,
      coupon_condition_flat:  securityDto.coupon_conditional && (securityDto.discount_type==false)?{
        min_cart_value_flat: securityDto.min_cart_value_flat,
      }:null,
      image: securityDto.image
    }

    const newPromo = new this.CouponsSchema(coupon_details);

    return await newPromo.save().then(
      (user: any) => {
        return user.toObject({ versionKey: false });
      },
      (error) => {
        let msg = 'Invalid Request!';
        if (error.errmsg) msg = error.errmsg;
        return new BadRequestException(msg);
      },
    );
  }

  async deleteCoupon(_id: string) {
    let uniqueId = { _id };
    return await this.CouponsSchema.deleteOne(uniqueId);
  }
}
