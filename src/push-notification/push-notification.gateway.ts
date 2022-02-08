import {
    SubscribeMessage,
    WebSocketGateway,
    WebSocketServer,
    WsResponse,
} from '@nestjs/websockets';
import { Socket, Server } from 'socket.io';
import { Injectable, Logger } from '@nestjs/common';
import { v4 as uuid } from 'uuid';
import { CronJob } from 'cron';
import { SchedulerRegistry } from '@nestjs/schedule';
// import fetch from 'node-fetch';
import axios from 'axios'
import delay from 'delay';


@WebSocketGateway(5001, {
    cors: {
        origin: '*',
    },
})
@Injectable()
export class NotificationGateway {

    constructor(private schedulerRegistry: SchedulerRegistry) { }

    @WebSocketServer()
    server: Server;
    private logger: Logger = new Logger('AppGateway');
    private axios = axios
    private jobStatus = false

    @SubscribeMessage('deliveryNotification')
    async handleDeliveryNotification(client: Socket, payload: any): Promise<string> {
        const deliveryBoys = payload.deliveryBoys;

        let i = 0;
        while (i < deliveryBoys.length) {
            if (this.jobStatus) {
                return deliveryBoys[i - 1];
            }
            this.sendPushNotification(deliveryBoys[i]);
            i++;
            await delay(10000)
        }
    }

    @SubscribeMessage('deliveryAccept')
    async handleFinishJob() {
        this.jobStatus = true
        return this.jobStatus
    }

    async sendPushNotification(deliveryBoy) {
        try {
            console.log(deliveryBoy)
            const headers = JSON.parse(JSON.stringify({
                "Authorization": "key=AAAArNJ8-t4:APA91bGZqcqwoLz5KbGglrq34TOqeTISkvxbSB0v3v4eI5O6eBXZZGX3qngVaPrfKYN3bIdc6N1N0bW19rofHqhWaQwrR77GZ9z9KhAYNYucckLSOJe9N0iUQuLIyrgwtxBTss5-aQ68",
                "Content-Type": "application/json"
            }))
            const body = JSON.parse(JSON.stringify({
                notification: {
                    title: "Title",
                    body: "delivery Notification",
                },
                registration_ids: ["dlfiJ2T0QeCBc55cVdwTKM:APA91bG1MdknQWqAfvanzOz-kyFGvnkpwMO3Cjs2GUynLKLoQz0AyRx16zGCrTyrzx7uQP4TEPa6jFXbUGvX2wXKL6iFLsRROrRL7pWPrBp7lZkz4wMzqxzJhbOZe7VRHJVhihxIR_Sr"]
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

    // async delay(ms) {
    //     // return await for better async stack trace support in case of errors.
    //     return await new Promise(resolve => setTimeout(resolve, ms));
    // }
}

// import {
//     SubscribeMessage,
//     WebSocketGateway,
//     OnGatewayInit,
//     WebSocketServer,
//     OnGatewayConnection,
//     OnGatewayDisconnect,
// } from '@nestjs/websockets';
// import { Logger } from '@nestjs/common';
// import { Socket, Server } from 'socket.io';
// import { v4 as uuid } from 'uuid';
// import { CronJob } from 'cron';

// @WebSocketGateway(5001)
// export class NotificationGateway implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {

//     @WebSocketServer() server: Server;
//     private logger: Logger = new Logger('AppGateway');

//     @SubscribeMessage('deliveryJob')
//     async handleDeliveryAccept(client: Socket, payload: any): Promise<void> {
//         // const SchedulerRegistry = require("@nestjs/schedule");
//         // SchedulerRegistry.deleteCronJob(name);
//         this.server.emit('msgToClient', payload);
//     }

//     afterInit(server: Server) {
//         this.logger.log('Init');
//     }

//     handleDisconnect(client: Socket) {
//         this.logger.log(`Client disconnected: ${client.id}`);
//     }

//     handleConnection(client: Socket, ...args: any[]) {
//         this.logger.log(`Client connected: ${client.id}`);
//         this.server.emit('Client connected');
//     }
// }