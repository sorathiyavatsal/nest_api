import {
  Controller,
  Get,
  Param,
  Post,
  Put,
  Query,
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
  ApiQuery
} from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { Role } from 'src/auth/role.enum';
import { Roles } from 'src/auth/roles.decorator';
import { SalesService } from './sales.service';
@Controller('sales')
@ApiTags('Sales')
@ApiBearerAuth()
@ApiSecurity('api_key')
export class SalesController {
  constructor(private salesService: SalesService) { }

  @Get('/')
  @UseGuards(AuthGuard('jwt'))
  @Roles(Role.ADMIN)
  @ApiOperation({
    summary: "get All Sales"
  })
  @ApiQuery({ name: 'storeId', required: false })
  async getAllSales(@Request() request, @Query() query) {
    return await this.salesService.getAllSales(query?.storeId || null);
  }

  @ApiParam({ name: 'id', required: true })
  @Get('/:id')
  @UseGuards(AuthGuard('jwt'))
  @Roles(Role.ADMIN)
  @ApiOperation({
    summary: "get Sales by Id"
  })
  async getSaleDetail(@Param() params, @Request() request: any) {
    return await this.salesService.getSaleDetail(params.id);
  }

  @Post('/')
  @UseGuards(AuthGuard('jwt'))
  @Roles(Role.ADMIN)
  @ApiOperation({summary:"add sales"})
  @ApiConsumes('multipart/form-data', 'application/json')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        invoiceId: {type: 'string'},
        storeId: {type: 'string'},
        salesAmount: { type: 'number' },
        platformCommission: { type: 'number' },
        grossIncome: { type: 'number' },
        settlementStatus: {type: 'boolean'}
      },
    },
  })
  async addSale(
    @Request() req: any,
  ) {
    return await this.salesService.addSale(req.body);
  }

  @Put('/:id')
  @UseGuards(AuthGuard('jwt'))
  @Roles(Role.ADMIN)
  @ApiOperation({summary:"update sales by Id"})
  @ApiConsumes('multipart/form-data', 'application/json')
  @ApiParam({ name: 'id', type: 'string', required: true })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        invoiceId: {type: 'string'},
        storeId: {type: 'string'},
        salesAmount: { type: 'number' },
        platformCommission: { type: 'number' },
        grossIncome: { type: 'number' },
        settlementStatus: {type: 'boolean'}
      },
    },
  })
  async updateSale(
    @Param() params,
    @Request() req,
  ) {
    return await this.salesService.updateSale(params.id, req.body);
  }
}
