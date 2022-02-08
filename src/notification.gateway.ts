import {
  SubscribeMessage,
  WebSocketGateway,
  OnGatewayInit,
  WebSocketServer,
  OnGatewayConnection,
  OnGatewayDisconnect,
} from '@nestjs/websockets';
import { Logger } from '@nestjs/common';
import { Socket, Server } from 'socket.io';
import { v4 as uuid } from 'uuid';
import { CronJob } from 'cron';

@WebSocketGateway({ namespace: '/pushNotification' })
export class NotificationGateway implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {

  @WebSocketServer() server: Server;
  private logger: Logger = new Logger('AppGateway');

  @SubscribeMessage('deliveryNotification')
  async handleDeliveryNotification(client: Socket, payload: any): Promise<void> {
    const axios = require('axios').default;
    const id: string = uuid();
    const SchedulerRegistry = require("@nestjs/schedule");
    const SettingsModel = require("src/settings/settings.model")
    const userModel = require("src/auth/user.model")

    let settings = await SettingsModel.find({});
    let maxDis: any = 10;
    let minDis: any = 0;

    let max_dis_data: any = settings.find((s: any) => (s.column_key == "max_distance_find"))
    if (max_dis_data) {
      maxDis = max_dis_data.column_value;

    }
    let min_dis_data: any = settings.find((s: any) => (s.column_key == "min_distance_find"))
    if (min_dis_data) {
      minDis = min_dis_data.column_value;
    }

    let deliveryBoys = await userModel.find(
      {
        role: 'DELIVERY',
        loc:
        {
          $geoWithin: {
            //$centerSphere: [[parseFloat(payload.fromLat), parseFloat(payload.fromLng)], 20 / 3963.2]
            $centerSphere: [ [ parseFloat(payload.fromLat) , parseFloat(payload.fromLng) ], maxDis/3963.2]
          }
        }
      }
    );

    for (let i = 0; i < deliveryBoys.length; i++) {
      const job = new CronJob(`*/1 * * * * *`, () => {
        this.sendPushNotification(axios)
      });

      SchedulerRegistry.addCronJob(id, job);
      job.start();
    }
    this.server.emit('deliveryResponse', payload);
  }

  async sendPushNotification(axios) {
    try {
      var notificationData = {
        title: 'Title',
        body: 'delivery Notification',
      }
      var fcm_tokens = ["e2sbxZ8UQXaUNEEmEvrMLh:APA91bGVE6f0qwMWisdN6JbjukhyVPX-9ZPdQ_0FyHtBCSE8Mjt60XEEVZfsS75Eam_sA9M_Ua1oW1t2u1s3bFs2iac3hhbu2bvi8tE9N9TDDNdc0_BEgzafllNK-8CKVRTx_uS8ca6S"];
      var notification_body = {
        'notification': notificationData,
        "registration_ids": fcm_tokens
      }
      const data = await axios('https://fcm.googleapis.com/fcm/send', {
        "method": "POST",
        "headers": {
          "Authorization": "key=AAAArNJ8-t4:APA91bGZqcqwoLz5KbGglrq34TOqeTISkvxbSB0v3v4eI5O6eBXZZGX3qngVaPrfKYN3bIdc6N1N0bW19rofHqhWaQwrR77GZ9z9KhAYNYucckLSOJe9N0iUQuLIyrgwtxBTss5-aQ68",
          "Content-type": "application/json"
        },
        "body": JSON.stringify(notification_body)
      })
      console.log(data)
    } catch (error) {
      console.log(error);
    }
  }

  @SubscribeMessage('deliveryJob')
  async handleDeliveryAccept(client: Socket, payload: any): Promise<void> {
    // const SchedulerRegistry = require("@nestjs/schedule");
    // SchedulerRegistry.deleteCronJob(name);
    this.server.emit('msgToClient', payload);
  }

  afterInit(server: Server) {
    this.logger.log('Init');
  }

  handleDisconnect(client: Socket) {
    this.logger.log(`Client disconnected: ${client.id}`);
  }

  handleConnection(client: Socket, ...args: any[]) {
    this.logger.log(`Client connected: ${client.id}`);
  }
}