import { Controller, SetMetadata, UploadedFiles, Request, Get, Post, Body, Put, ValidationPipe, Query, Req, Res, Param, UseGuards, UseInterceptors, UploadedFile } from '@nestjs/common';
import { DashboardService } from './dashboard.service';
import { ApiTags, ApiSecurity, ApiBearerAuth, ApiParam, ApiConsumes, ApiOperation } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
@Controller('da')
@ApiTags('Dashboard')
@ApiSecurity('api_key')
@ApiBearerAuth()
@UseGuards(AuthGuard('jwt'))
export class DashboardController {
    constructor(private dashboarService: DashboardService) {

    }
  
  @ApiOperation({summary:'Merchant Delivery Boy Dashboard'})
  @Get('/get')

  async dahboard(@Request() req) {

    return await this.dashboarService.dashboardData(req.user);
  }
  @Get('/earnings')

  async earningBooks(@Request() req) {

    return await this.dashboarService.earningData(req.user);
  }
  @Get('/trips')

  async tripBooks(@Request() req) {

    return await this.dashboarService.tripData(req.user);
  }
  @Get('/profile')

  async dashboardProfile(@Request() req) {

    return await this.dashboarService.profileData(req.user);
  }
}
