import { Injectable, BadRequestException } from '@nestjs/common';
import { Good } from './goods.model';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { ConfigService } from 'src/core/config/config.service';

@Injectable()
export class GoodsService {
  constructor(
    private configService: ConfigService,
    @InjectModel('Goods') private GoodsModel: Model<Good>,
    @InjectModel('Weights') private WeightModel: Model<Good>,
    @InjectModel('Packages') private PackageModel: Model<Good>,
  ) {}
  async getActiveGoods(user: any) {
    let goods: any = await this.GoodsModel.find({ activeStatus: true });

    let results: any = [];
    for (let i = 0; i < goods.length; i++) {
      let element = goods[i];
      let extGet = ['jpg', 'png'];
      let filename = 'd';
      if (element.name) filename = element.name + '.png';
      if (element.image && element.image.path) filename = element.image.path;
      let weights: any = await this.WeightModel.aggregate([
        { $match: { goods: element._id } },
        { $group: { _id: 'goods', max_weight: { $max: '$to_weight' } } },
      ]).limit(1);
      let packs: any = await this.PackageModel.aggregate([
        { $match: { goods: element._id } },
        { $group: { _id: 'goods', max_pack: { $max: '$to_pack' } } },
      ]).limit(1);
      element.image = {
        max_weight: weights,
        max_pack: packs,
        path: this.configService.get('WEB_APP_URI') + filename,
      };
      results.push(element);
    }
    return goods;
  }
  async getAllGoods(user: any) {
    return this.GoodsModel.find({}).sort({ orderNumber: 1 });
  }
  async getGoodsDetail(id: any) {
    return this.GoodsModel.findById(id);
  }
  async updateGoods(id: string, securityDto: any, user: any) {
    return this.GoodsModel.findOne({ _id: id }).then(
      (data) => {
        data.name = securityDto.name;
        data.activeStatus = securityDto.activeStatus;
        data.modifiedBy = user._id;
        data.svgImage = securityDto.svgImage;
        if (securityDto.image) data.image = securityDto.image;
        data.save();
        return data.toObject({ versionKey: false });
      },
      (error) => {
        let msg = 'Invalid Request!';
        if (error.errmsg) msg = error.errmsg;
        return new BadRequestException(msg);
      },
    );
  }
  async createGoods(securityDto: any, user: any) {
    const newUser = new this.GoodsModel({
      image: securityDto.image,
      name: securityDto.name,
      createdBy: user._id,
      modifiedBy: user._id,
      svgImage: securityDto.svgImage,
      activeStatus: securityDto.activeStatus,
      orderNumber: securityDto.orderNumber,
    });

    return await newUser.save().then(
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
