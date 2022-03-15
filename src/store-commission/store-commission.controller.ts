import {
  Body,
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
import { StoreCommissionService } from './store-commission.service';
import { Role } from 'src/auth/role.enum';
import { Roles } from 'src/auth/roles.decorator';

@Controller('store-commission')
@ApiTags('Store_Commission')
@ApiBearerAuth()
@ApiSecurity('api_key')
export class StoreCommissionController {
  constructor(private storeCommissionService: StoreCommissionService) { }

  @Get('/')
  @UseGuards(AuthGuard('jwt'))
  @Roles(Role.ADMIN)
  @ApiOperation({
    summary: "get All Store Commissions"
  })
  async getAllStoreCommissions(@Request() request) {
    return await this.storeCommissionService.getAllStoreCommissions();
  }

  @ApiParam({ name: 'id', required: true })
  @Get('/:id')
  @UseGuards(AuthGuard('jwt'))
  @Roles(Role.ADMIN)
  @ApiOperation({
    summary: "get Store Commissions by Id"
  })
  async getStoreCommissionDetail(@Param() params, @Request() request: any) {
    return await this.storeCommissionService.getStoreCommissionDetail(params.id);
  }

  @Post('/')
  @UseGuards(AuthGuard('jwt'))
  @Roles(Role.ADMIN)
  @ApiOperation({summary:"add Store Commissions"})
  @ApiConsumes('multipart/form-data', 'application/json')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        planCode: {type: 'string'},
        category: { 
          type: 'array',
          items: {
            type: 'object',
            properties: {
              categoryId: {type: 'string'},
              commissionAmount: {type: 'object', description: 'for general return only amount, and for range return array of object like {to: 1, from: 100, value: 20}'},
            }
          },
        },
        applicableType: { type: 'string', enum: ['INVOICE', 'CATEGORY'] },
        commissionType: { type: 'string', enum: ['GENERAL', 'RANGE'] },
        commissionAmountType: { type: 'boolean', description: 'true for Percentile, false for Flat' },
        description: {type: 'string'}
      },
    },
  })
  async addStoreCommission(
    @Request() req: any,
  ) {
    return await this.storeCommissionService.addStoreCommission(req.body);
  }

  @Put('/:id')
  @UseGuards(AuthGuard('jwt'))
  @Roles(Role.ADMIN)
  @ApiOperation({summary:"update Store Commissions by Id"})
  @ApiConsumes('multipart/form-data', 'application/json')
  @ApiParam({ name: 'id', type: 'string', required: true })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        planCode: {type: 'string'},
        category: { 
          type: 'array',
          items: {
            type: 'object',
            properties:{
              categoryId: {type: 'string'},
              commissionAmount: {type: 'object', description: 'for general return only amount, and for range return array of object like {from: 1, to: 100, value: 20}'},
            }
          },
        },
        applicableType: { type: 'string', enum: ['INVOICE', 'CATEGORY'] },
        commissionType: { type: 'string', enum: ['GENERAL', 'RANGE'] },
        commissionAmountType: { type: 'boolean', description: 'true for Percentile, false for Flat' },
        description: {type: 'string'}
      },
    },
  })
  async updateStoreCommission(
    @Param() params,
    @Request() req,
  ) {
    return await this.storeCommissionService.updateStoreCommission(params.id, req.body);
  }
}
