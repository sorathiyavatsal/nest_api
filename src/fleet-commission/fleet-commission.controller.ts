import {
  Controller,
  Get,
  Post,
  Delete,
  Body,
  Put,
  Req,
  Param,
  UseGuards,
  UseInterceptors,
  UploadedFile,
  Query,
} from '@nestjs/common';
import {
  ApiTags,
  ApiSecurity,
  ApiBearerAuth,
  ApiParam,
  ApiConsumes,
  ApiOperation,
} from '@nestjs/swagger';
import { FleetCommissionService } from './fleet-commission.service';
import { AuthGuard } from '@nestjs/passport';
import { Roles } from '../auth/roles.decorator';
import { fleetCommissionDto, filterDto } from './dto/fleet-commission.dto';

@Controller('fleet-commission')
@ApiTags('Fleet_Commission')
@ApiBearerAuth()
@ApiSecurity('api_key')
export class FleetCommissionController {
  constructor(private FleetCommissionService: FleetCommissionService) {}

  @ApiOperation({ summary: 'Get All Fleet Commissions' })
  @UseGuards(AuthGuard('jwt'))
  @Get('/')
  async getAllFleetCommission(@Query() filter: filterDto, @Req() req) {
    return await this.FleetCommissionService.getAllFleetCommission(filter);
  }

  @ApiOperation({ summary: 'Get Fleet Commission By Id' })
  @UseGuards(AuthGuard('jwt'))
  @ApiParam({ name: 'id', required: true })
  @ApiConsumes('multipart/form-data', 'application/json')
  @Get('/:id')
  async getFleetCommissionById(@Param() params, @Req() req) {
    return await this.FleetCommissionService.getFleetCommissionById(params.id);
  }

  @ApiOperation({ summary: 'Add New Fleet Commission' })
  @UseGuards(AuthGuard('jwt'))
  @ApiConsumes('multipart/form-data', 'application/json')
  @Post('/')
  async addNewFleetCommission(@Body() fleetCommission: fleetCommissionDto, @Req() req) {
    return await this.FleetCommissionService.addNewFleetCommission(fleetCommission);
  }

  @ApiOperation({ summary: 'Update Existing Fleet Commission' })
  @UseGuards(AuthGuard('jwt'))
  @ApiParam({ name: 'id', required: true })
  @ApiConsumes('multipart/form-data', 'application/json')
  @Put('/:id')
  async updateFleetCommission(@Param() params, @Body() fleetCommission: fleetCommissionDto, @Req() req) {
    return await this.FleetCommissionService.updateFleetCommission(params.id, fleetCommission);
  }
}
