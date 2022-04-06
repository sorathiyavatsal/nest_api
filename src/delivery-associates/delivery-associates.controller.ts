import { Controller, Get, UseGuards, Response, Query } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiTags, ApiBearerAuth, ApiSecurity, ApiQuery } from '@nestjs/swagger';
import { Roles } from 'src/auth/roles.decorator';
import { DeliveryAssociatesService } from './delivery-associates.service';

@Controller('delivery-associates')
@ApiTags('delivery-associates')
@ApiBearerAuth()
@ApiSecurity('api_key')
export class DeliveryAssociatesController {
  constructor(private deliveryAssociatesService: DeliveryAssociatesService) {}

  @Get('/')
  @ApiQuery({ name: 'partnerId', type: 'string', required: false })
  @ApiQuery({ name: 'work_load', type: 'string', required: false })
  @ApiQuery({ name: 'vehical_type', type: 'string', required: false })
  @ApiQuery({ name: 'vehical_number', type: 'string', required: false })
  @ApiQuery({ name: 'job_status', type: 'string', required: false })
  @ApiQuery({ name: 'duty_status', type: 'string', required: false })
  @ApiQuery({ name: 'limit', type: 'string', required: false })
  @ApiQuery({ name: 'page', type: 'string', required: false })
  @UseGuards(AuthGuard('jwt'))
  async getAllDeliveryAssociates(@Query() query, @Response() response) {
    const data =
      await this.deliveryAssociatesService.getAllDeliveryAssociates();
    response.json(data);
  }
}
