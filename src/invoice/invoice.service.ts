import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Invoice } from './invoice.model';
let ObjectId = require('mongodb').ObjectId;

@Injectable()
export class InvoiceService {
  constructor(@InjectModel('Invoice') private InvoiceModel: Model<Invoice>) {}

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
    let invoice = {
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
