import {
    SubscribeMessage,
    WebSocketGateway,
    WebSocketServer,
} from '@nestjs/websockets';
import { Socket, Server } from 'socket.io';
import { Logger } from '@nestjs/common';
import axios from 'axios'
import delay from 'delay';
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
    private delivery_fleet_id = ""
    private token = ""

    @SubscribeMessage('deliveryNotification')
    async handleDeliveryNotification(client: Socket, payload: any): Promise<Object> {
        try {
            const deliveryBoys = payload.deliveryBoys;
            this.token = payload.token
            this.delivery_fleet_id = payload.delivery_fleet_id
            const deliveryFleet = await axios({
                method: "GET",
                url: `http://3.134.140.172:5000/api/delivery-fleet/${this.delivery_fleet_id}`,
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
                            return this.deliveryAcceptBoy
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
    async handleAcceptJob(client: Socket, payload: any) {
        this.jobStatus = true

        await axios({
            method: "PUT",
            url: `http://3.134.140.172:5000/api/delivery-fleet/update/${this.delivery_fleet_id}`,
            data: JSON.parse(JSON.stringify({
                'invoiceStatus' : 'complete'
            })),
            headers: JSON.parse(JSON.stringify({
                "Authorization": "Bearer " + this.token
            })),
        })
        
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
                    title: "Byecom JOB notification",
                    body: "You got new Job",
                },
                registration_ids: [deliveryBoy.deviceId],
                data: JSON.stringify({
                    distance: deliveryFleet.distance,
                    price: deliveryFleet.price,
                    fromLocation: {
                        Address: deliveryFleet.fromAddress,
                        Lat: deliveryFleet.fromLat,
                        Lng: deliveryFleet.fromLng,
                    }
                })
            }))
            const data = await axios({
                method: "POST",
                url: "https://fcm.googleapis.com/fcm/send",
                data: body,
                headers: headers,
            })
        } catch (error) {
            this.logger.log(error.message)
        }
    }
}