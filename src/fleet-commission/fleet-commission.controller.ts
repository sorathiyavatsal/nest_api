import {
  Controller,
  SetMetadata,
  UploadedFiles,
  Request,
  Get,
  Post,
  Delete,
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
import {
  ApiTags,
  ApiProperty,
  ApiSecurity,
  ApiBearerAuth,
  ApiParam,
  ApiConsumes,
  ApiOperation,
} from '@nestjs/swagger';
import { FleetCommissionService } from './fleet-commission.service';
import { AuthGuard } from '@nestjs/passport';
import { Roles } from '../auth/roles.decorator';
import { ApiBody } from '@nestjs/swagger';

@Controller('fleet-commission')
@ApiTags('Fleet_Commission')
@ApiBearerAuth()
@ApiSecurity('api_key')
export class FleetCommissionController {
  constructor(private FleetCommissionService: FleetCommissionService) {}

  @Get('/all')
  @UseGuards(AuthGuard('jwt'))
  @Roles('ADMIN')
  async getAllFleetCommission(@Request() request) {
    return await this.FleetCommissionService.getAllFleetCommission();
  }

  @Post('/add')
  @UseGuards(AuthGuard('jwt'))
  @ApiConsumes('multipart/form-data', 'application/json')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        name: {
          type: 'string',
        },
        wagesTime: {
          type: 'string',
        },
        wagesDay: {
          type: 'string',
        },
        wagesAmount: {
          type: 'number',
        },
        fuelPrice: {
          type: 'number',
        },
        fuelKM: {
          type: 'number',
        },
        addtionalPerKM: {
          type: 'number',
        },
        addtionalPerHours: {
          type: 'number',
        },
        incentive: {
          type: 'number',
        },
        surcharge: {
          type: 'number',
        },
      },
    },
  })
  async postPartners(@Request() request) {
    return await this.FleetCommissionService.postSettlements();
  }
}
