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

  async updatePromotion(_id: string, securityDto: any, user: any) {
    let uniqueId = { _id };
    let updateBody = securityDto;
    console.log(uniqueId);
    console.log(updateBody);
    return await this.PromotionSchema.updateOne(uniqueId, updateBody);
  }

  async deletePromotion(_id: string) {
    let uniqueId = { _id };

    console.log(uniqueId);

    return await this.PromotionSchema.deleteOne(uniqueId);
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
