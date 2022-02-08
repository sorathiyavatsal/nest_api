import { Controller, SetMetadata, UploadedFiles, Request, Get, Post, Delete, Body, Put, ValidationPipe, Query, Req, Res, Param, UseGuards, UseInterceptors, UploadedFile } from '@nestjs/common';
import { ApiTags, ApiProperty, ApiSecurity, ApiBearerAuth, ApiParam, ApiConsumes, ApiOperation } from '@nestjs/swagger';
import { PushNotificationService } from "./push-notification.service"
import { AuthGuard } from '@nestjs/passport';
import { DeliveryBoyNotificationDto } from './dto/deliveryBoy.notification';
import { DeliveryBoyAcceptDto } from './dto/deliveryAccept';
import { DeliveryBoyRejectDto } from './dto/deliveryReject';


@Controller('push-notification')
@ApiTags('Push_Notification')
@ApiBearerAuth()
@ApiSecurity('api_key')
export class PushNotificationController {
    constructor(private PushNotificationService: PushNotificationService) { }

    @Post('/deliveryBoy')
    @UseGuards(AuthGuard('jwt'))
    @ApiConsumes('multipart/form-data','application/json')
    async postDeliveryBoy(@Body() Dto: DeliveryBoyNotificationDto) {
        return await this.PushNotificationService.postDeliveryBoyNotification(Dto);
    }

    @Post('/deliveryBoy/accept')
    @UseGuards(AuthGuard('jwt'))
    @ApiConsumes('multipart/form-data','application/json')
    async postDeliveryBoyAccept(@Body() Dto: DeliveryBoyAcceptDto) {
        return await this.PushNotificationService.postAcceptNotification(Dto);
    }
    
    @Post('/deliveryBoy/reject')
    @UseGuards(AuthGuard('jwt'))
    @ApiConsumes('multipart/form-data','application/json')
    async postDeliveryBoyReject(@Body() Dto: DeliveryBoyRejectDto) {
        return await this.PushNotificationService.postAcceptNotification(Dto);
    }
}
