import {
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Socket, Server } from 'socket.io';
import { Logger } from '@nestjs/common';
import axios from 'axios';
import delay from 'delay';
@WebSocketGateway(5001, {
  cors: true,
})
export class NotificationGateway {
  @WebSocketServer()
  server: Server;
  private logger: Logger = new Logger('AppGateway');

  @SubscribeMessage('deliveryNotification')
  async handleDeliveryNotification(client: Socket, payload: any) {
    try {
      client.join(payload.delivery_fleet_id);
      let deliveryBoys = await axios({
        method: 'POST',
        url: `http://3.134.140.172:5000/api/delivery-fleet/find-near-delivery-boy`,
        headers: JSON.parse(
          JSON.stringify({
            Authorization: 'Bearer ' + payload.token,
          }),
        ),
        data: {
          fromLat: payload.loc[0],
          fromLng: payload.loc[1],
        },
      });

      deliveryBoys = deliveryBoys.data.boys;

      const deliveryFleet = await axios({
        method: 'GET',
        url: `http://3.134.140.172:5000/api/delivery-fleet/${payload.delivery_fleet_id}`,
        headers: JSON.parse(
          JSON.stringify({
            Authorization: 'Bearer ' + payload.token,
          }),
        ),
      });

      if (deliveryFleet) {
        if (Array.isArray(deliveryBoys)) {
          let i = 0;
          while (i < deliveryBoys.length) {
            this.sendPushNotification(deliveryBoys[i], deliveryFleet.data);
            i++;
            await delay(10000);
          }
        } else {
          this.sendPushNotification(deliveryBoys, deliveryFleet.data);
        }
      } else {
      }
    } catch (e) {
      console.log(e);
    }
  }

  @SubscribeMessage('deliveryAccept')
  async handleAcceptJob(client: Socket, payload: any) {
    const delivery_fleet = await axios({
      method: 'PUT',
      url: `http://3.134.140.172:5000/api/delivery-fleet/update/${payload.delivery_fleet_id}`,
      data: JSON.parse(
        JSON.stringify({
          invoiceStatus: 'complete',
        }),
      ),
      headers: JSON.parse(
        JSON.stringify({
          Authorization: 'Bearer ' + payload.token,
        }),
      ),
    });

    const delivery_boy = await axios({
      method: 'GET',
      url: `http://3.134.140.172:5000/api/users/profile/${payload.delivery_boy_id}`,
      headers: JSON.parse(
        JSON.stringify({
          Authorization: 'Bearer ' + payload.token,
        }),
      ),
    });

    const response = {
      delivery_fleet: delivery_fleet,
      delivery_boy: delivery_boy,
    };

    this.server
      .to(payload.delivery_fleet_id)
      .emit('deliveryResponse', delivery_boy.data._id);
    await client.leave(payload.delivery_fleet_id);

    return response;
  }

  @SubscribeMessage('deliveryReject')
  async handleRejectJob(client: Socket, payload: any) {
    const data = await client.rooms.delete(payload.delivery_boy_id);
  }

  async sendPushNotification(deliveryBoy, deliveryFleet) {
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
            title: 'Byecom JOB notification',
            body: 'You got new Job',
          },
          registration_ids: [deliveryBoy.deviceId],
          data: JSON.parse(
            JSON.stringify({
              deliveryFleet_id: deliveryFleet._id,
              deliveryBoy_id: deliveryBoy._id,
              expire_time: new Date(
                new Date(new Date().toUTCString()).getTime() + 2 * 60000,
              ),
            }),
          ),
        }),
      );

      const data = await axios({
        method: 'POST',
        url: 'https://fcm.googleapis.com/fcm/send',
        data: body,
        headers: headers,
      });
    } catch (error) {
      this.logger.log(error.message);
    }
  }

  @SubscribeMessage('patchLocation')
  async handlePathLocation(client: Socket, payload: any) {
    const data = await axios({
      method: 'PUT',
      url: `http://3.134.140.172:5000/api/users/location/${payload.delivery_boy_id}`,
      headers: JSON.parse(
        JSON.stringify({
          Authorization: 'Bearer ' + payload.token,
        }),
      ),
      data: {
        lat: payload.loc[0],
        lng: payload.loc[1],
      },
    });
    this.server.emit('Location', { loc: data.data.loc });
  }
}
