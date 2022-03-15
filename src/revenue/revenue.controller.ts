import {
  Controller,
  Get,
  Param,
  Post,
  Put,
  Request,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiBody,
  ApiConsumes,
  ApiOperation,
  ApiParam,
  ApiSecurity,
  ApiTags,
} from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { Role } from 'src/auth/role.enum';
import { Roles } from 'src/auth/roles.decorator';
import { RevenueService } from './revenue.service';
@Controller('revenue')
@ApiTags('Revenue')
@ApiBearerAuth()
@ApiSecurity('api_key')
export class RevenueController {
  constructor(private revenueService: RevenueService) { }

  @Get('/')
  @UseGuards(AuthGuard('jwt'))
  @Roles(Role.ADMIN)
  @ApiOperation({
    summary: "get All revenues"
  })
  async getAllRevenues(@Request() request) {
    return await this.revenueService.getAllRevenues();
  }

  @ApiParam({ name: 'id', required: true })
  @Get('/:id')
  @UseGuards(AuthGuard('jwt'))
  @Roles(Role.ADMIN)
  @ApiOperation({
    summary: "get revenue by Id"
  })
  async getRevenueDetail(@Param() params, @Request() request: any) {
    return await this.revenueService.getRevenueDetail(params.id);
  }

  @Post('/')
  @UseGuards(AuthGuard('jwt'))
  @Roles(Role.ADMIN)
  @ApiOperation({ summary: "add revenue" })
  @ApiConsumes('multipart/form-data', 'application/json')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        invoiceId: { type: 'string' },
        revenueFrom: {
          type: 'object',
          properties: {
            storeId: { type: 'string' },
            deliveryFleetId: { type: 'string' },
          }
        },
        revenueType: { type: 'string', enum: ['STORE', 'FLEET'] },
        revenueAmount: { type: 'number' },
      },
    },
  })
  async addRevenue(
    @Request() req: any,
  ) {
    return await this.revenueService.addRevenue(req.body);
  }

  @Put('/:id')
  @UseGuards(AuthGuard('jwt'))
  @Roles(Role.ADMIN)
  @ApiOperation({ summary: "update revenue by Id" })
  @ApiConsumes('multipart/form-data', 'application/json')
  @ApiParam({ name: 'id', type: 'string', required: true })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        invoiceId: { type: 'string' },
        revenueFrom: {
          type: 'object',
          properties: {
            storeId: { type: 'string' },
            deliveryFleetId: { type: 'string' },
          }
        },
        revenueType: { type: 'string', enum: ['STORE', 'FLEET'] },
        revenueAmount: { type: 'number' },
      },
    },
  })
  async updateRevenue(
    @Param() params,
    @Request() req,
  ) {
    return await this.revenueService.updateRevenue(params.id, req.body);
  }
}
