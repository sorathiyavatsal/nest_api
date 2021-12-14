import { Test, TestingModule } from '@nestjs/testing';
import { DeliveryFleetController } from './deliveryfleet.controller';

describe('Delivery Controller', () => {
  let controller: DeliveryFleetController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [DeliveryFleetController],
    }).compile();

    controller = module.get<DeliveryFleetController>(DeliveryFleetController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
