import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { reviews } from './reviews.model';
import { Injectable, BadRequestException } from '@nestjs/common';
import { Product } from 'src/product/product.model';
import { UserData } from 'src/user-data/user-data.model';
let ObjectId = require('mongodb').ObjectId;

@Injectable()
export class ReviewsService {
  constructor(
    @InjectModel('Products') private productModel: Model<Product>,
    @InjectModel('reviews') private reviewsModel: Model<reviews>,
    @InjectModel('UserData') private UserDataModel: Model<UserData>,
  ) {}
  async getAllreviews() {
    return await this.reviewsModel.find({});
  }

  async getreviewsById(review: any) {
    return await this.reviewsModel.findById(review);
  }

  async addNewreviews(dto: any) {
    const newreview = {
      rating: dto.rating,
      reviewedBy: ObjectId(dto.reviewedBy),
      reviewto: ObjectId(dto.reviewto),
      reviewType: dto.reviewType,
      comment: dto.comment,
    };

    const review = await new this.reviewsModel(newreview).save();

    if (dto.reviewType == 'product') {
      await this.productModel.findByIdAndUpdate(
        { _id: new ObjectId(dto.reviewto) },
        {
          $push: {
            review: review._id,
          },
        },
      );

      const productdata = await this.productModel.aggregate([
        { $match: { _id: ObjectId(dto.reviewto) } },
        {
          $lookup: {
            from: 'reviews',
            localField: 'review',
            foreignField: '_id',
            as: 'reviews',
          },
        },
      ]);

      const reviewLength = productdata[0].review.length;
      let sum = 0;
      for (let i = 0; i < reviewLength; i++) {
        sum = sum + productdata[0]['reviews'][i]['rating'];
      }

      await this.productModel.findByIdAndUpdate(
        { _id: new ObjectId(dto.reviewto) },
        {
          $set: {
            avgreview: (sum / reviewLength).toFixed(1),
          },
        },
      );
    }

    if (dto.reviewType == 'store') {
      await this.UserDataModel.findByIdAndUpdate(
        { _id: new ObjectId(dto.reviewto) },
        {
          $push: {
            review: review._id,
          },
        },
      );

      const productdata = await this.UserDataModel.aggregate([
        { $match: { _id: ObjectId(dto.reviewto) } },
        {
          $lookup: {
            from: 'reviews',
            localField: 'review',
            foreignField: '_id',
            as: 'reviews',
          },
        },
      ]);

      const reviewLength = productdata[0].review.length;
      let sum = 0;
      for (let i = 0; i < reviewLength; i++) {
        sum = sum + productdata[0]['reviews'][i]['rating'];
      }

      await this.UserDataModel.findByIdAndUpdate(
        { _id: new ObjectId(dto.reviewto) },
        {
          $set: {
            avgreview: (sum / reviewLength).toFixed(1),
          },
        },
      );
    }

    return review;
  }

  async updatereviews(id: string, dto: any) {
    let reviewUpdate = {};
    if (dto.rating) {
      reviewUpdate['rating'] = dto.rating;
    }

    if (dto.reviewedBy) {
      reviewUpdate['reviewedBy'] = ObjectId(dto.reviewedBy);
    }

    if (dto.reviewto) {
      reviewUpdate['reviewto'] = ObjectId(dto.reviewto);
    }

    if (dto.reviewType) {
      reviewUpdate['reviewType'] = ObjectId(dto.reviewType);
    }

    if (dto.comment) {
      reviewUpdate['comment'] = ObjectId(dto.comment);
    }

    return await this.reviewsModel.findOneAndUpdate(
      { _id: new ObjectId(id) },
      { $set: dto },
      { new: true },
    );
  }
}
