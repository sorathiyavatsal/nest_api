import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { PurchaseInvoice } from './invoice.model';
let ObjectId = require('mongodb').ObjectId;

@Injectable()
export class InvoiceService {
  constructor(
    @InjectModel('PurchaseInvoice')
    private InvoiceModel: Model<PurchaseInvoice>,
  ) {}

  async getAllInvoices() {
    return await this.InvoiceModel.aggregate([
      {
        $lookup: {
          from: 'users',
          localField: 'paidId',
          foreignField: '_id',
          as: 'paidDetails',
        },
      },
      { $unwind: '$paidDetails' },
      {
        $lookup: {
          from: 'users',
          localField: 'receiveId',
          foreignField: '_id',
          as: 'receiveDetails',
        },
      },
      { $unwind: '$receiveDetails' },
    ]);
  }

  async getInvoiceDetail(invoiceId: String) {
    return await this.InvoiceModel.aggregate([
      {
        $lookup: {
          from: 'users',
          localField: 'paidId',
          foreignField: '_id',
          as: 'paidDetails',
        },
      },
      { $unwind: '$paidDetails' },
      {
        $lookup: {
          from: 'users',
          localField: 'receiveId',
          foreignField: '_id',
          as: 'receiveDetails',
        },
      },
      { $unwind: '$receiveDetails' },
      { $match: { _id: ObjectId(invoiceId) } },
    ]);
  }

  async addInvoice(invoiceDto: any, user: any) {
    let InvoiceNo = '';

    const InvoiceCount = await this.InvoiceModel.find({}).count();

    if (InvoiceCount >= 0 || InvoiceCount < 10) {
      InvoiceNo = '#00000' + InvoiceCount + 1;
    } else if (InvoiceCount >= 0 || InvoiceCount < 10) {
      InvoiceNo = '#0000' + InvoiceCount + 1;
    } else if (InvoiceCount >= 0 || InvoiceCount < 10) {
      InvoiceNo = '#000' + InvoiceCount + 1;
    } else if (InvoiceCount >= 0 || InvoiceCount < 10) {
      InvoiceNo = '#00' + InvoiceCount + 1;
    } else if (InvoiceCount >= 0 || InvoiceCount < 10) {
      InvoiceNo = '#0' + InvoiceCount + 1;
    } else {
      InvoiceNo = '#' + InvoiceCount + 1;
    }

    let invoice = {
      invoiceId: InvoiceNo,
      method: invoiceDto.method,
      transationId: invoiceDto.transationId,
      paymentGatewayId: invoiceDto.paymentGatewayId,
      paymentGatewayStatus: invoiceDto.paymentGatewayStatus,
      paidId: ObjectId(invoiceDto.paidId),
      paidBy: invoiceDto.paidBy,
      receiveId: ObjectId(invoiceDto.receiveId),
      receiceBy: invoiceDto.receiceBy,
      amount: invoiceDto.amount,
      charges: invoiceDto.charges,
    };

    return await new this.InvoiceModel(invoice).save();
  }
}
