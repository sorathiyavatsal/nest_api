import { Injectable, BadRequestException } from '@nestjs/common';
import { Promotion } from './promotion.schema';
import { CouponsSchema } from 'src/coupons/coupons.schema';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { v5 as uuidv5 } from 'uuid';
import { ConfigService } from 'src/core/config/config.service';
import { SendEmailMiddleware } from './../core/middleware/send-email.middleware';
import { WeightsSchema } from 'src/weight/weight.model';
import { PackagesSchema } from 'src/packages/packages.model';
import { toBase64 } from 'utils/common';
​
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
  // async getPromotionsForUser(promotionDto: any) {
  //   let query = promotionDto.age
  //     ? { promotion_target_age: promotionDto.age }
  //     : promotionDto.gender
  //     ? { promotion_target_gender: promotionDto.gender }
  //     : promotionDto.location
  //     ? { promotion_target_location: promotionDto.location }
  //     : {
  //         promotion_target_location: promotionDto.location,
  //         promotion_target_gender: promotionDto.gender,
  //         promotion_target_age: promotionDto.age,
  //       };
  //   const Promotions = await this.PromotionSchema.aggregate([
  //     {
  //       $match: query,
  //     },
  //   ]);
  //   return await this.PromotionSchema.populate(Promotions, {
  //     path: 'coupon_id',
  //   });
  // }
  async updatePromotion(_id: string, securityDto: any, user: any) {
    try {
      let id = { _id };
      console.log(id)
      let body = securityDto;
      console.log(body)
      return await this.PromotionSchema.updateOne(id, body);
     
    } catch (e) {
      console.log(e)
 
      return new BadRequestException(e);
    }
  }
​
  async deletePromotion(_id: string) {
    try {
      let uniqueId = { _id };
​
      console.log(uniqueId);
​
      return await this.PromotionSchema.deleteOne(uniqueId);
    } catch (e) {
      return new BadRequestException(e);
    }
  }
​
  
  //The format here is same as the format in Mongo
  async createPromotion(securityDto: any) {
    const newPromo = new this.PromotionSchema({
      name: securityDto.name,
      description: securityDto.description,
      image: securityDto.image,
      target: { 
        device_based: securityDto.device ,
        area_based: securityDto.area,
        user_based: { 
          merchant : securityDto.merchant,
          consumer: securityDto.consumer,
          da: securityDto.da
        }
      },
      // promotion_content_type: securityDto.promotion_content_type,
      promotion_for_coupon: securityDto.promotion_for_coupon,
      type: securityDto.type,
      placement: securityDto.placement,
      date: { 
        start_date: securityDto.start_date,
        end_date: securityDto.end_date
      },
      
      createdBy: securityDto.createdBy,
      modifiedBy: securityDto.modifiedBy,
    });
​
    return newPromo.save().then(
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
}