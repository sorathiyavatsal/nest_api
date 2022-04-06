import { Injectable, BadRequestException } from '@nestjs/common';
import { Promotion } from './promotion.schema';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Ads } from './ads.schema';
import { AdsView } from './adsView.schema';
let ObjectId = require('mongodb').ObjectId;
var _ = require('underscore');

@Injectable()
export class PromotionService {
  constructor(
    @InjectModel('Promotion') private PromotionSchema: Model<Promotion>,
    @InjectModel('Ads') private AdsSchema: Model<Ads>,
    @InjectModel('AdsView') private AdsViewSchema: Model<AdsView>,
  ) {}

  async getPromitionall() {
    return await this.PromotionSchema.find({});
  }

  async getPromitionById(_id: string) {
    return await this.PromotionSchema.find({
      _id: ObjectId(_id),
    });
  }

  async getPromitionFilter(filterDto: any) {
    var Promotion = await this.PromotionSchema.find();

    filterDto.promotionId
      ? (Promotion = _.filter(Promotion, (e) => e._id == filterDto.promotionId))
      : '';

    filterDto.network
      ? (Promotion = _.filter(Promotion, (e) => e.network == filterDto.network))
      : '';
    filterDto.promotionType
      ? (Promotion = _.filter(
          Promotion,
          (e) => e.type == filterDto.promotionType,
        ))
      : '';
    filterDto.page
      ? (Promotion = _.filter(
          Promotion,
          (e) => e.placement.page == filterDto.page,
        ))
      : '';

    filterDto.user_condition && filterDto.user_condition.gender
      ? (Promotion = _.filter(
          Promotion,
          (e) => e.target.user_based.gender == filterDto.user_condition.gender,
        ))
      : '';
    filterDto.user_condition && filterDto.user_condition.age
      ? (Promotion = _.filter(
          Promotion,
          (e) => e.target.user_based.age == filterDto.user_condition.age,
        ))
      : '';

    filterDto.device
      ? (Promotion = _.filter(
          Promotion,
          (e) => e.target.device_based == filterDto.device,
        ))
      : '';

    return Promotion;
  }

  async createPromotionAdsView(adsViewDto: any) {
    return await new this.AdsViewSchema(adsViewDto).save();
  }

  async deletePromotion(_id: string) {
    try {
      return await this.PromotionSchema.findByIdAndDelete({
        _id: ObjectId(_id),
      });
    } catch (e) {
      return new BadRequestException(e);
    }
  }

  async createPromotion(promotionDto: any) {
    let condition = {
      network: promotionDto.network,
      type: promotionDto.promotionType,
      target: {
        device_based: promotionDto.device,
        area_based: promotionDto.area,
      },
      placement: {
        page: promotionDto.page,
        section: promotionDto.section,
      },
      date: {
        start_date: promotionDto.start_date,
        end_date: promotionDto.end_date,
      },
      user_based: {},
    };

    if (promotionDto.network == 'MARCHANT' && promotionDto.merchant) {
      condition['target']['user_based'] = promotionDto.merchant;
    }

    if (promotionDto.network == 'CONSUMER' && promotionDto.consumer) {
      condition['target']['user_based'] = promotionDto.consumer;
    }

    if (promotionDto.network == 'DELIVERY BOY' && promotionDto.deliveryBoy) {
      condition['target']['user_based'] = promotionDto.deliveryBoy;
    }

    const newPromo = await new this.PromotionSchema(condition);
    return await newPromo.save();
  }

  async updatePromotion(_id: string, promotionDto: any) {
    let condition = {};

    if (promotionDto.network) {
      condition['network'] = promotionDto.network;
    }

    if (promotionDto.promotionType) {
      condition['type'] = promotionDto.promotionType;
    }

    if (promotionDto.device || promotionDto.area) {
      condition['target'] = {};
      if (promotionDto.device) {
        condition['device_based'] = promotionDto.device;
      }

      if (promotionDto.area) {
        condition['area_based'] = promotionDto.area;
      }
    }

    if (promotionDto.page || promotionDto.section) {
      condition['placement'] = {};
      if (promotionDto.page) {
        condition['page'] = promotionDto.page;
      }

      if (promotionDto.section) {
        condition['section'] = promotionDto.section;
      }
    }

    if (promotionDto.start_date || promotionDto.end_date) {
      condition['date'] = {};
      if (promotionDto.start_date) {
        condition['start_date'] = promotionDto.start_date;
      }

      if (promotionDto.end_date) {
        condition['end_date'] = promotionDto.end_date;
      }
    }

    if (promotionDto.network) {
      if (
        promotionDto.merchant ||
        promotionDto.consumer ||
        promotionDto.deliveryBoy
      ) {
        condition['user_based'] = {};
        if (promotionDto.network == 'MARCHANT' && promotionDto.merchant) {
          condition['target']['user_based'] = promotionDto.merchant;
        }

        if (promotionDto.network == 'CONSUMER' && promotionDto.consumer) {
          condition['target']['user_based'] = promotionDto.consumer;
        }

        if (
          promotionDto.network == 'DELIVERY BOY' &&
          promotionDto.deliveryBoy
        ) {
          condition['target']['user_based'] = promotionDto.deliveryBoy;
        }
      }
    }

    return await this.PromotionSchema.findByIdAndUpdate(
      { _id: ObjectId(_id) },
      { $set: condition },
      { $upset: true },
    );
  }

  async createPromotionAds(adsDto: any) {
    const newPromoAds = await new this.AdsSchema(adsDto);
    const ads = await newPromoAds.save();

    await this.PromotionSchema.findByIdAndUpdate(
      { _id: ObjectId(adsDto.promotionId) },
      {
        $push: {
          ads: ads._id,
        },
      },
      { $upset: true },
    );

    return ads;
  }

  async updatePromotionAds(_id: string, adsDto: any) {
    let condition = {};

    if (adsDto.promotionId) {
      condition['promotionId'] = adsDto.promotionId;
    }

    if (adsDto.coupon) {
      condition['coupon'] = adsDto.coupon;
    }

    if (adsDto.title) {
      condition['title'] = adsDto.title;
    }

    if (adsDto.description) {
      condition['description'] = adsDto.description;
    }

    if (adsDto.expiryDate) {
      condition['expiryDate'] = adsDto.expiryDate;
    }

    if (adsDto.image) {
      condition['image'] = adsDto.image;
    }

    return await this.AdsSchema.findByIdAndUpdate(
      { _id: ObjectId(_id) },
      {
        $set: {
          ads: condition,
        },
      },
      { $upset: true },
    );
  }

  async deletePromotionAds(_id: string) {
    try {
      return await this.AdsSchema.findByIdAndDelete({
        _id: ObjectId(_id),
      });
    } catch (e) {
      return new BadRequestException(e);
    }
  }
}
