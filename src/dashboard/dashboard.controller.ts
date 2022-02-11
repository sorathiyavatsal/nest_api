import {
  Controller,
  SetMetadata,
  UploadedFiles,
  Request,
  Get,
  Post,
  Body,
  Put,
  ValidationPipe,
  Query,
  Req,
  Res,
  Param,
  UseGuards,
  UseInterceptors,
  UploadedFile,
} from '@nestjs/common';
import { DashboardService } from './dashboard.service';
import {
  ApiTags,
  ApiSecurity,
  ApiBearerAuth,
  ApiParam,
  ApiConsumes,
  ApiOperation,
} from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { earningsFilterDto } from './dto/earnings.filter.dto';
import { distanceRequestDto } from './dto/distnace_request.dto';
@Controller('da')
@ApiTags('Delivery Associte')
@ApiSecurity('api_key')
@ApiBearerAuth()
@UseGuards(AuthGuard('jwt'))
export class DashboardController {
  constructor(private dashboarService: DashboardService) {}

  @ApiOperation({
    summary: 'Delivery Boy Dashboard',
    description: 'Upcoming and Previous data and Upcoming total ride',
  })
  @Get('/today/ongoing-upcoming/trips')
  async dahboard(@Request() req) {
    return await this.dashboarService.dashboardData(req.user);
  }

  @ApiConsumes('multipart/form-data', 'application/json')
  @Post('/earnings/graph')
  @ApiOperation({
    summary: 'Delivery Boy Dashboard Graph Data',
    description:
      'please pass startDate and EndDate. 9th Earning figma screen. Today (start and end same date). Yesterday ( yesterday start and end date), Tomorrow (tomorrow is start and end date).',
  })
  async tripBooks(@Body() earningsFilter: earningsFilterDto, @Request() req) {
    return await this.dashboarService.tripData(earningsFilter, req.user);
  }

  @ApiConsumes('multipart/form-data', 'application/json')
  @Post('/distance-request')
  @ApiOperation({
    summary: 'Delivery Boy request for distance',
    description: '.',
  })
  async distanceRequest(
    @Body() distanceRequest: distanceRequestDto,
    @Request() req,
  ) {
    return await this.dashboarService.distanceReuqest(
      distanceRequest,
      req.user,
    );
  }

  @Get('/profile')
  @ApiOperation({ summary: 'Delivery Boy Profile Data' })
  async dashboardProfile(@Request() req) {
    return await this.dashboarService.profileData(req.user);
  }
}
