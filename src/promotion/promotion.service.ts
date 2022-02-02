import { Injectable, BadRequestException } from '@nestjs/common';
import { Promotion } from './promotion.schema';
import { CouponsSchema } from 'src/coupons/coupons.schema';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { v5 as uuidv5 } from 'uuid';
import { ConfigService } from 'src/core/config/config.service';
import { SendEmailMiddleware } from './../core/middleware/send-email.middleware';
import { UseRoles } from 'nest-access-control';
import { WeightsSchema } from 'src/weight/weight.model';
import { PackagesSchema } from 'src/packages/packages.model';
import { toBase64 } from 'utils/common';

@Injectable()
export class PromotionService {
  constructor(
    @InjectModel('Promotion') private PromotionSchema: Model<Promotion>,
  ) {}
  async getAllPromotion(user: any) {
    return this.PromotionSchema.find({});
  }
  async getPromotionbyId(id: any, user: any) {
    return this.PromotionSchema.findOne({});
  }
  async getPromotionsForUser(promotionDto: any) {
    let query = promotionDto.age
      ? { promotion_target_age: promotionDto.age }
      : promotionDto.gender
      ? { promotion_target_gender: promotionDto.gender }
      : promotionDto.location
      ? { promotion_target_location: promotionDto.location }
      : {
          promotion_target_location: promotionDto.location,
          promotion_target_gender: promotionDto.gender,
          promotion_target_age: promotionDto.age,
        };
    const Promotions = await this.PromotionSchema.aggregate([
      {
        $match: query,
      },
    ]);
    return await this.PromotionSchema.populate(Promotions, {
      path: 'coupon_id',
    });
  }
  async updatePromotion(_id: string, securityDto: any, user: any) {
    try {
      let uniqueId = { _id };
      let updateBody = securityDto;
      return await this.PromotionSchema.updateOne(uniqueId, updateBody);
    } catch (e) {
      return new BadRequestException(e);
    }
  }

  async deletePromotion(_id: string) {
    try {
      let uniqueId = { _id };

      console.log(uniqueId);

      return await this.PromotionSchema.deleteOne(uniqueId);
    } catch (e) {
      return new BadRequestException(e);
    }
  }

  async applyPromotion(coupon_id: string, couponBody: any, user: any) {
    let message;
    try {
      let offer_price, final_price;

      const promotion = await this.PromotionSchema.findOne({
        coupon_id,
      }).populate('coupon_id');
      if (
        promotion.promotion_end_date < Date.now() ||
        promotion.coupon_id.coupon_expiration < Date.now()
      ) {
        if (promotion.promotion_type == 'flat') {
          offer_price = promotion.promotion_flat_offer;
          if (promotion.applicable_price >= couponBody.orderPrice) {
            final_price = couponBody.orderPrice - offer_price;
            return {
              status: 200,
              final_discount: final_price,
            };
          } else {
            message = 'Coupon is Not valid for this order';
            return new BadRequestException(message);
          }
        } else if (promotion.promotion_type == 'percentage') {
          offer_price = promotion.promotion_percentage_offer;
          if (promotion.applicable_price >= couponBody.orderPrice) {
            final_price =
              couponBody.orderPrice -
              (couponBody.orderPrice * offer_price) / 100;
            return {
              status: 200,
              final_discount: final_price,
            };
          } else {
            message = 'Coupon is Not valid for this order';
          }
        }
      } else {
        message = 'Coupon is Expired';
      }
    } catch (e) {
      return new BadRequestException(message);
    }
  }

  async createPromotion(securityDto: any, user: any) {
    const newPromo = new this.PromotionSchema({
      promotion_name: securityDto.name,
      promotion_description: securityDto.description,
      promotion_image: securityDto.image,
      promotion_content_type: securityDto.content_type,
      merchant_id: securityDto.merchant_id,
      coupon_id: securityDto.coupon_id,
      promotion_target_type: securityDto.target_type,
      promotion_Device_type: securityDto.Device_type,
      promotion_user_type: securityDto.user_type,
      promotion_type: securityDto.type,
      promotion_target_filters: securityDto.target_filters,
      promotion_target_users_by: securityDto.target_users_by,
      createdBy: securityDto.createdBy,
      modifiedBy: securityDto.modifiedBy,
    });

    return newPromo.save().then(
      (user: any) => {
        return user.toObject({ versionKey: false });
      },
      error => {
        let msg = 'Invalid Request!';
        if (error.errmsg) msg = error.errmsg;
        return new BadRequestException(msg);
      },
    );
  }
}