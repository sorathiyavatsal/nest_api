import { Injectable, BadRequestException } from '@nestjs/common';
import { Weights } from './weight.model';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateWeightsDto } from './dto/create-weight';
import { EditWeightsDto } from './dto/edit-weight';
import { v5 as uuidv5 } from 'uuid';
import { ConfigService } from 'src/core/config/config.service';
import { SendEmailMiddleware } from '../core/middleware/send-email.middleware';
@Injectable()
export class WeightsService {
  constructor(
    private configService: ConfigService,
    private sendEmailMiddleware: SendEmailMiddleware,
    @InjectModel('Weights') private WeightsModel: Model<Weights>,
  ) {}

  async validateApiKey(key: string) {
    return await this.WeightsModel.findOne({ apiKey: key, activeStatus: true });
  }
  async getAllWeights(user: any) {
    return this.WeightsModel.find({}).populate('category', 'name svgImage');
  }
  async getWeightsDetail(id: any) {
    return this.WeightsModel.findById(id).populate('category', 'name svgImage');
  }
  async updateWeights(id: string, weightDto: EditWeightsDto, user: any) {
    return this.WeightsModel.findOne({ _id: id }).then(
      (data) => {
        data.category = weightDto.category;
        data.from_weight = weightDto.from_weight;
        data.to_weight = weightDto.to_weight;
        data.rate = weightDto.rate;
        data.modifiedBy = user._id;
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
  async createWeights(weightDto: CreateWeightsDto, user: any) {
    const data: any = weightDto;
    data.createdBy = user._id;
    data.modifiedBy = user._id;
    const newUser = new this.WeightsModel(data);
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

  async deleteWeights(id: string): Promise<any> {
    return await this.WeightsModel.findByIdAndRemove(id);
  }
}
