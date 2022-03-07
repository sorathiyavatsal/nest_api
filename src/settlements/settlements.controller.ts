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
import { SettlementsService } from './settlements.service';
import { AuthGuard } from '@nestjs/passport';
import { Roles } from '../auth/roles.decorator';
import { ApiBody } from '@nestjs/swagger';

@Controller('settlements')
@ApiTags('Settlements')
@ApiBearerAuth()
@ApiSecurity('api_key')
export class SettlementsController {
  constructor(private SettlementsService: SettlementsService) {}

  @Get('/all')
  @UseGuards(AuthGuard('jwt'))
  @Roles('ADMIN')
  async getAllSettlements(@Request() request) {
    return await this.SettlementsService.getAllSettlements();
  }

  @Post('/add')
  @UseGuards(AuthGuard('jwt'))
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        deliveryBoy: {
          type: 'string',
        },
        workInHours: {
          type: 'number',
        },
        travelledKM: {
          type: 'number',
        },
        payAmount: {
          type: 'number',
        },
        bankName: {
          type: 'string',
        },
        bankAccNo: {
          type: 'string',
        },
        bankIFSC: {
          type: 'string',
        },
        inputDate: {
          type: 'date',
        },
        amountPay: {
          type: 'number',
        },
        receiptId: {
          type: 'string',
        },
      },
    },
  })
  @ApiConsumes('multipart/form-data', 'application/json')
  async postSettlements(@Request() request) {
    return await this.SettlementsService.postSettlements(request.Body);
  }

  @Post('/downloadCSV')
  @UseGuards(AuthGuard('jwt'))
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        settlementId: {
          type: 'string',
        },
      },
    },
  })
  @ApiConsumes('multipart/form-data', 'application/json')
  async postDownloadCSV(@Request() request, @Res() res) {
    const fields = [
      {
        label: 'ID',
        value: 'ID',
      },
      {
        label: 'Date',
        value: 'Date',
      },
      {
        label: 'Hours',
        value: 'Hours',
      },
      {
        label: 'Distance',
        value: 'Distance',
      },
      {
        label: 'Earning	Balance',
        value: 'Earning_Balance',
      },
    ];

    const data = await this.SettlementsService.postSettlements({})

    return await this.SettlementsService.downloadResource(
      res,
      'result.csv',
      fields,
      data,
    );
  }
}
