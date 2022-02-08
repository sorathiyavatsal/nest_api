import {
    SubscribeMessage,
    WebSocketGateway,
    WebSocketServer,
} from '@nestjs/websockets';
import { Socket, Server } from 'socket.io';
import { Logger } from '@nestjs/common';
import axios from 'axios'
import delay from 'delay';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { DeliveryFleet } from '../delivery_fleet/deliveryfleet.model';

@WebSocketGateway(5001, {
    cors: {
        origin: '*',
    },
})
export class NotificationGateway {
    @WebSocketServer()
    server: Server;
    private logger: Logger = new Logger('AppGateway');
    private axios = axios
    private jobStatus = false
    private deliveryAcceptBoy = {}

    @SubscribeMessage('deliveryNotification')
    async handleDeliveryNotification(client: Socket, payload: any): Promise<void> {
        try {
            const deliveryBoys = payload.deliveryBoys;

            const deliveryFleet = await axios({
                method: "GET",
                url: `http://localhost:5000/api/delivery-fleet/${payload.delivery_fleet_id}`,
                headers: JSON.parse(JSON.stringify({
                    "Authorization": "Bearer " + payload.token
                })),
            })
            if (deliveryFleet) {
                if (Array.isArray(deliveryBoys)) {
                    let i = 0;
                    while (i < deliveryBoys.length) {
                        this.deliveryAcceptBoy = deliveryBoys[i]
                        if (this.jobStatus) {
                            break;
                        }
                        this.sendPushNotification(deliveryBoys[i], deliveryFleet.data);
                        i++;
                        await delay(10000)
                    }
                } else {
                    this.deliveryAcceptBoy = deliveryBoys
                    this.sendPushNotification(deliveryBoys, deliveryFleet.data);
                }
            }
        } catch (e) {
            console.log(e)
        }
    }

    @SubscribeMessage('deliveryAccept')
    async handleAcceptJob() {
        this.jobStatus = true
        return this.deliveryAcceptBoy
    }

    @SubscribeMessage('deliveryReject')
    async handleRejectJob() {
        this.jobStatus = false
        return this.jobStatus
    }

    async sendPushNotification(deliveryBoy, deliveryFleet) {
        try {
            const headers = JSON.parse(JSON.stringify({
                "Authorization": "key=AAAArNJ8-t4:APA91bGZqcqwoLz5KbGglrq34TOqeTISkvxbSB0v3v4eI5O6eBXZZGX3qngVaPrfKYN3bIdc6N1N0bW19rofHqhWaQwrR77GZ9z9KhAYNYucckLSOJe9N0iUQuLIyrgwtxBTss5-aQ68",
                "Content-Type": "application/json"
            }))
            const body = JSON.parse(JSON.stringify({
                notification: {
                    title: "You got new Job",
                    body: {
                        distance: deliveryFleet.distance,
                        price: deliveryFleet.price,
                        fromLocation: {
                            Address: deliveryFleet.fromAddress,
                            Zipcode: deliveryFleet.fromZipcode,
                            Lat: deliveryFleet.fromLat,
                            Lng: deliveryFleet.fromLng,
                        },
                        toLocation: {
                            Address: deliveryFleet.toAddress,
                            Zipcode: deliveryFleet.toZipcode,
                            Lat: deliveryFleet.toLat,
                            Lng: deliveryFleet.toLng,
                        }
                    },
                },
                registration_ids: ["dlfiJ2T0QeCBc55cVdwTKM:APA91bG1MdknQWqAfvanzOz-kyFGvnkpwMO3Cjs2GUynLKLoQz0AyRx16zGCrTyrzx7uQP4TEPa6jFXbUGvX2wXKL6iFLsRROrRL7pWPrBp7lZkz4wMzqxzJhbOZe7VRHJVhihxIR_Sr"]
                //registration_ids: [deliveryBoy.deviceId]
            }))
            // const data = await axios({
            //     method: "POST",
            //     url: "https://fcm.googleapis.com/fcm/send",
            //     data: body,
            //     headers: headers,
            // })
        } catch (error) {
            this.logger.log(error.message)
        }
    }
}