import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import axios from 'axios';
import { Model } from 'mongoose';
import { Notification } from './notification.model';
let ObjectId = require('mongodb').ObjectId;

@Injectable()
export class NotificationService {
  private logger: Logger = new Logger('Notification');

  constructor(
    @InjectModel('Notification') private NotificationModel: Model<Notification>,
  ) {}

  async getAllnotification(filter: any) {
    let condition = {};

    if (filter.userId) {
      condition['userId'] = ObjectId(filter.userId);
    }
    return await this.NotificationModel.find(condition);
  }

  async getFilternotification(id: any) {
    return await this.NotificationModel.find({
      _id: ObjectId(id),
    });
  }

  async sendNotification(notificationDto: any) {
    try {
      const headers = JSON.parse(
        JSON.stringify({
          Authorization:
            'key=AAAArNJ8-t4:APA91bGZqcqwoLz5KbGglrq34TOqeTISkvxbSB0v3v4eI5O6eBXZZGX3qngVaPrfKYN3bIdc6N1N0bW19rofHqhWaQwrR77GZ9z9KhAYNYucckLSOJe9N0iUQuLIyrgwtxBTss5-aQ68',
          'Content-Type': 'application/json',
        }),
      );

      const body = JSON.parse(
        JSON.stringify({
          notification: {
            title: notificationDto.title,
            body: notificationDto.content,
          },
          registration_ids: [notificationDto.deviceId],
          data: JSON.parse(
            JSON.stringify(
              notificationDto.extraData ? notificationDto.extraData : {},
            ),
          ),
        }),
      );

      const data = await axios({
        method: 'POST',
        url: 'https://fcm.googleapis.com/fcm/send',
        data: body,
        headers: headers,
      });

      const datas = await new this.NotificationModel(notificationDto).save();

      return datas;
    } catch (error) {
      this.logger.log(error.message);
    }
  }
}
