import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Parser } from 'json2csv';
import { Model } from 'mongoose';
import { Settlement } from './settlements.model';
let ObjectId = require('mongodb').ObjectId;

@Injectable()
export class SettlementsService {
  constructor(
    @InjectModel('Settlement') private SettlementModel: Model<Settlement>,
  ) {}

  async getAllSettlements() {
    return await this.SettlementModel.aggregate([
        {
          $lookup: {
            from: 'users',
            localField: 'deliveryBoy',
            foreignField: '_id',
            as: 'deliveryBoyDetails',
          },
        },
        {
          $unwind: {
            path: '$deliveryBoyDetails',
            preserveNullAndEmptyArrays: true,
          },
        },
      ]);
  }

  async getSettlements(SettlementId: String) {
    return await this.SettlementModel.aggregate([
        {
          $lookup: {
            from: 'users',
            localField: 'deliveryBoy',
            foreignField: '_id',
            as: 'deliveryBoyDetails',
          },
        },
        {
          $unwind: {
            path: '$deliveryBoyDetails',
            preserveNullAndEmptyArrays: true,
          },
        },
        { $match: { _id: ObjectId(SettlementId) } },
      ]);
  }

  async postSettlements(settlementDto: any) {
    let Settlement = {
      deliveryBoy: settlementDto.deliveryBoy,
      workInHours: settlementDto.workInHours,
      travelledKM: settlementDto.travelledKM,
      payAmount: settlementDto.payAmount,
      bankName: settlementDto.bankName,
      bankAccNo: settlementDto.bankAccNo,
      bankIFSC: settlementDto.bankIFSC,
      inputDate: settlementDto.inputDate,
      amountPay: settlementDto.amountPay,
      receiptId: settlementDto.receiptId,
    };

    return await new this.SettlementModel(Settlement).save();
  }

  async downloadResource(res, fileName, fields, data) {
    const json2csv = new Parser({ fields });
    const csv = json2csv.parse(data);
    res.header('Content-Type', 'text/csv');
    res.attachment(fileName);
    return res.send(csv);
  }
}
