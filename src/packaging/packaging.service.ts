import { PackagesModule } from './../packages/packages.module';
import { Injectable, BadRequestException } from '@nestjs/common';
import { Packagings } from './packaging.model';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreatePackagingsDto } from './dto/create-packaging';
import { EditPackagingsDto } from './dto/edit-packaging';
import { v5 as uuidv5 } from 'uuid';
import { ConfigService } from 'src/core/config/config.service';
import { SendEmailMiddleware } from '../core/middleware/send-email.middleware';
@Injectable()
export class PackagingsService {
  constructor(
    private configService: ConfigService,
    private sendEmailMiddleware: SendEmailMiddleware,
    @InjectModel('Packagings') private PackagingsModel: Model<Packagings>,
  ) {}

  async getAllPackagings(user: any) {
    return this.PackagingsModel.find({}).populate('category', 'name svgImage');
  }
  async getPackagingsDetail(id: any) {
    return this.PackagingsModel.findById(id).populate('category', 'name svgImage');
  }
  async updatePackagings(
    id: string,
    PackagingsDto: EditPackagingsDto,
    user: any,
  ) {
    return this.PackagingsModel.findById({ _id: id }).then(
      (data) => {
        data.category = PackagingsDto.category;
        data.rate = PackagingsDto.rate;
        data.modifiedBy = user._id;
        data.activeStatus = PackagingsDto.activeStatus;
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
  async createPackagings(PackagingsDto: CreatePackagingsDto, user: any) {
    const newUser = new this.PackagingsModel(PackagingsDto);
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

  async deletePackagings(id: string): Promise<any> {
    return await this.PackagingsModel.findByIdAndRemove(id);
  }
}
