import { Test, TestingModule } from '@nestjs/testing';
import { DeliveryFleetService } from './deliveryfleet.service';

describe('InvoiceService', () => {
  let service: DeliveryFleetService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [DeliveryFleetService],
    }).compile();

    service = module.get<DeliveryFleetService>(DeliveryFleetService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
