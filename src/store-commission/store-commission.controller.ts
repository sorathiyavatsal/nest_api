import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Put,
  Request,
  Query,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiBody,
  ApiConsumes,
  ApiOperation,
  ApiParam,
  ApiQuery,
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
  constructor(private storeCommissionService: StoreCommissionService) {}

  @Get('/')
  @UseGuards(AuthGuard('jwt'))
  @ApiOperation({
    summary: 'get All Store Commissions',
  })
  @ApiQuery({ name: 'categoryName', type: 'string', required: false })
  @ApiQuery({ name: 'planCode', type: 'number', required: false })
  @ApiQuery({ name: 'applicationType', type: 'number', required: false })
  @ApiQuery({ name: 'comissionType', type: 'string', required: false })
  @ApiQuery({ name: 'limit', type: 'string', required: false })
  @ApiQuery({ name: 'page', type: 'string', required: false })
  async getAllStoreCommissions(@Request() request, @Query() query) {
    return await this.storeCommissionService.getAllStoreCommissions();
  }

  @ApiParam({ name: 'id', required: true })
  @Get('/:id')
  @UseGuards(AuthGuard('jwt'))
  @ApiOperation({
    summary: 'get Store Commissions by Id',
  })
  async getStoreCommissionDetail(@Param() params, @Request() request: any) {
    return await this.storeCommissionService.getStoreCommissionDetail(
      params.id,
    );
  }

  @Post('/')
  @UseGuards(AuthGuard('jwt'))
  @ApiOperation({ summary: 'add Store Commissions' })
  @ApiConsumes('multipart/form-data', 'application/json')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        planCode: { type: 'string' },
        values: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              categoryId: { type: 'string' },
              to: { type: 'number' },
              from: { type: 'number' },
              amount: { type: 'number' },
              type: { type: 'boolean' },
            },
            example: {
              categoryId: '621837622904011bde645a36',
              to: 0,
              from: 20,
              amount: 15,
              type: true,
            },
          },
        },
        applicableType: { type: 'string', enum: ['INVOICE', 'CATEGORY'] },
        commissionType: { type: 'string', enum: ['GENERAL', 'RANGE'] },
        description: { type: 'string' },
        status: { type: 'boolean' },
      },
    },
  })
  async addStoreCommission(@Request() req: any) {
    return await this.storeCommissionService.addStoreCommission(req.body);
  }

  @Put('/:id')
  @UseGuards(AuthGuard('jwt'))
  @ApiOperation({ summary: 'update Store Commissions by Id' })
  @ApiConsumes('multipart/form-data', 'application/json')
  @ApiParam({ name: 'id', type: 'string', required: true })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        planCode: { type: 'string' },
        values: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              categoryId: { type: 'string' },
              to: { type: 'number' },
              from: { type: 'number' },
              amount: { type: 'number' },
              type: { type: 'boolean' },
            },
            example: {
              categoryId: '621837622904011bde645a36',
              to: 0,
              from: 20,
              amount: 15,
              type: true,
            },
          },
        },
        applicableType: { type: 'string', enum: ['INVOICE', 'CATEGORY'] },
        commissionType: { type: 'string', enum: ['GENERAL', 'RANGE'] },
        description: { type: 'string' },
        status: { type: 'boolean' },
      },
    },
  })
  async updateStoreCommission(@Param() params, @Request() req) {
    return await this.storeCommissionService.updateStoreCommission(
      params.id,
      req.body,
    );
  }
}
