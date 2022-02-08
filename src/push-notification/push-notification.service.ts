import { Injectable, Logger } from '@nestjs/common';
import { SchedulerRegistry } from '@nestjs/schedule';
import { Settings } from '../settings/settings.model';
import { UserLogin } from 'src/core/models/userLogin.model';
import { User } from '../auth/user.model';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import * as WebSocket from "ws";
import { CronJob } from 'cron';
import { v4 as uuid } from 'uuid';

@Injectable()
export class PushNotificationService {
  constructor(
    private schedulerRegistry: SchedulerRegistry,
    @InjectModel('Users') private UserModel: Model<User>,
    @InjectModel('UserLogin') private UserLogin: Model<UserLogin>,
    @InjectModel('Settings') private SettingsModel: Model<Settings>,
  ) { }

  private readonly logger = new Logger(PushNotificationService.name);

  async postDeliveryBoyNotification(notification: any) {
    await setTimeout(async function () {
      console.log("testing")
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
    }, 5000);
  }

  async postAcceptNotification(job: any) {
    this.schedulerRegistry.deleteCronJob(job.id);
  }
}
