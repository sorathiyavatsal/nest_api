import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Sales } from './sales.model';
let ObjectId = require('mongodb').ObjectId;

@Injectable()
export class SalesService {
  constructor(@InjectModel('Sales') private salesModel: Model<Sales>) { }

  async getAllSales(id: any) {
    const query = {
      ...(id ? { storeId: ObjectId(id) } : {}),
    }
    return await this.salesModel.find({ ...query });
  }

  async getSaleDetail(id: string) {
    return await this.salesModel.findOne({ _id: ObjectId(id) });
  }

  async addSale(salesDto: any) {
    const checkExisting = await this.salesModel.findOne({ invoiceId: ObjectId(salesDto.invoiceId), storeId: ObjectId(salesDto.storeId) });
    if (checkExisting) {
      return new BadRequestException("Invoice already exist!");
    }
    const newSales = new this.salesModel(salesDto);
    return await newSales.save().then(
      (s: any) => {
        return s.toObject({ versionKey: false });
      },
      (error) => {
        let msg = 'Invalid Request!';
        if (error.errmsg) msg = error.errmsg;
        console.log(error);
        return new BadRequestException(msg);
      },
    );
  }

  async updateSale(id: any, salesDto: any) {
    return await this.salesModel.findOneAndUpdate(
      { _id: ObjectId(id) },
      { $set: salesDto },
      { new: true, upsert: true }
    ).then(data => {
      return data.toObject({ versionKey: false });
    }).catch(err => {
      console.log(err);
      return new BadRequestException(err);
    });
  }
}
