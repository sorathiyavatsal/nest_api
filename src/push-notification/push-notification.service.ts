import { Injectable, Logger } from '@nestjs/common';
import { SchedulerRegistry } from '@nestjs/schedule';
import { Settings } from '../settings/settings.model';
import { UserLogin } from 'src/core/models/userLogin.model';
import { User } from '../auth/user.model';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CronJob } from 'cron';
import { v4 as uuid } from 'uuid';

@Injectable()
export class PushNotificationService {
  constructor(
    private schedulerRegistry: SchedulerRegistry,
    @InjectModel('Users') private UserModel: Model<User>,
    @InjectModel('UserLogin') private UserLogin: Model<UserLogin>,
    @InjectModel('Settings') private SettingsModel: Model<Settings>,
  ) {}

  private readonly logger = new Logger(PushNotificationService.name);

  async postDeliveryBoyNotification(notification: any) {
    // const job = new CronJob(`*/1 * * * * *`, () => {
    //   this.logger.warn(notification);
    // });

    const id: string = uuid();

    // this.schedulerRegistry.addCronJob(id, job);
    // job.start();

    // deleting job
    // this.schedulerRegistry.deleteCronJob(name);

    let settings = await this.SettingsModel.find({});
    let maxDis: any = 10;
    let minDis: any = 0;

    let max_dis_data: any = settings.find(
      (s: any) => s.column_key == 'max_distance_find',
    );
    if (max_dis_data) {
      maxDis = max_dis_data.column_value;
    }
    let min_dis_data: any = settings.find(
      (s: any) => s.column_key == 'min_distance_find',
    );
    if (min_dis_data) {
      minDis = min_dis_data.column_value;
    }

    try {
    //   var FCM = require('fcm-node');
    //   var serverKey = 'AAAArNJ8-t4:APA91bGZqcqwoLz5KbGglrq34TOqeTISkvxbSB0v3v4eI5O6eBXZZGX3qngVaPrfKYN3bIdc6N1N0bW19rofHqhWaQwrR77GZ9z9KhAYNYucckLSOJe9N0iUQuLIyrgwtxBTss5-aQ68';
    //   var fcm = new FCM(serverKey);

    //   var message = {
    //     //this may vary according to the message type (single recipient, multicast, topic, et cetera)
    //     to:
    //       'e2sbxZ8UQXaUNEEmEvrMLh:APA91bGVE6f0qwMWisdN6JbjukhyVPX-9ZPdQ_0FyHtBCSE8Mjt60XEEVZfsS75Eam_sA9M_Ua1oW1t2u1s3bFs2iac3hhbu2bvi8tE9N9TDDNdc0_BEgzafllNK-8CKVRTx_uS8ca6S',
    //     collapse_key: '742265780958',

    //     notification: {
    //       title: 'Title',
    //       body: 'delivery Notification',
    //     },

    //     data: {
    //       //you can send only notification or only data(or include both)
    //       my_key: 'accept',
    //       my_another_key: 'reject',
    //     },
    //   };

    //   fcm.send(message, function(err, response) {
    //     if (err) {
    //       console.log('Something has gone wrong!', err);
    //     } else {
    //       console.log('Successfully sent with response: ', response);
    //     }
    //   });

    var notificationData = {
              title: 'Title',
              body: 'delivery Notification',
            }


    var fcm_tokens = [];

    var notification_body = {
        'notification': notificationData,
        "registration_ids": fcm_tokens
    }

    const axios = require('axios').default;

    const data = await axios('https://fcm.googleapis.com/fcm/send', {
        "method" : "POST",
        "headers" : {
            "Authorization": "key=AAAArNJ8-t4:APA91bGZqcqwoLz5KbGglrq34TOqeTISkvxbSB0v3v4eI5O6eBXZZGX3qngVaPrfKYN3bIdc6N1N0bW19rofHqhWaQwrR77GZ9z9KhAYNYucckLSOJe9N0iUQuLIyrgwtxBTss5-aQ68",
            "Content-type": "application/json"
        },
        "body": JSON.stringify(notification_body)
    }) 
    console.log(data)
    } catch (error) {
      console.log(error);
    }

    let deliveryBoy = await this.UserModel.find({
      role: 'DELIVERY',
      loc: {
        $geoWithin: {
          $centerSphere: [
            [parseFloat(notification.fromLat), parseFloat(notification.fromLng)],
            20 / 3963.2,
          ],
          //$centerSphere: [ [ parseFloat(order.fromLat) , parseFloat(order.fromLng) ], maxDis/3963.2]
        },
      },
    });

    return { boys: deliveryBoy };
  }

  async postAcceptNotification(job: any) {
    this.schedulerRegistry.deleteCronJob(job.id);
  }
}
