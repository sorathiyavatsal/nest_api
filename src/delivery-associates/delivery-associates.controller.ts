import { Controller, Get, UseGuards, Response } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiTags, ApiBearerAuth, ApiSecurity } from '@nestjs/swagger';
import { Roles } from 'src/auth/roles.decorator';
import { DeliveryAssociatesService } from './delivery-associates.service';

@Controller('delivery-associates')
@ApiTags('delivery-associates')
@ApiBearerAuth()
@ApiSecurity('api_key')
export class DeliveryAssociatesController {
  constructor(private deliveryAssociatesService: DeliveryAssociatesService) { }

  @Get('/')
  @UseGuards(AuthGuard('jwt'))
  @Roles('ADMIN')
  async getAllDeliveryAssociates(
    @Response() response) {
    const data = await this.deliveryAssociatesService.getAllDeliveryAssociates();
    response.json(data)
  }
}
