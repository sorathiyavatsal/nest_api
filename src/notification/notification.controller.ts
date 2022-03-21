import { Body, Controller, Post, UseGuards, Request, Get, Query } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import {
  ApiBearerAuth,
  ApiConsumes,
  ApiOperation,
  ApiQuery,
  ApiSecurity,
  ApiTags,
} from '@nestjs/swagger';
import { NotificationDto } from './dto/send-notification';
import { NotificationService } from './notification.service';

@Controller('notification')
@ApiTags('notification')
@ApiBearerAuth()
@ApiSecurity('api_key')
export class NotificationController {
  constructor(private notificationService: NotificationService) {}

  @ApiOperation({ summary: 'Get All Notification' })
  @UseGuards(AuthGuard('jwt'))
  @Get('/all')
  @ApiQuery({ name: 'userId', type: 'string', required: false })
  async getAllcatalogue(@Request() req, @Query() query) {
    return await this.notificationService.getAllnotification(query);
  }

  @ApiOperation({ summary: 'Get User All Notification' })
  @UseGuards(AuthGuard('jwt'))
  @Get('/')
  @ApiQuery({ name: 'id', type: 'string', required: true })
  async getFiltercatalogue(@Request() req, @Query() query) {
    return await this.notificationService.getFilternotification(query);
  }
  
  @Post('/send')
  @UseGuards(AuthGuard('jwt'))
  @ApiConsumes('multipart/form-data', 'application/json')
  async postNotification(@Body() notificationDto: NotificationDto) {
    return await this.notificationService.sendNotification(notificationDto);
  }
}
