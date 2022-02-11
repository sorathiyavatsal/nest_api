import { IsString, IsEmail, IsNotEmpty, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class MangerDeliveryCredentialsDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    description: 'SMS or EMAIL is value. You can use SMS for mobile app',
    default: 'SMS',
  })
  verifyType: string;

  @IsString()
  @ApiProperty({
    description: 'Merchant App = MERCHANT , Delivery App = DELIVERY',
  })
  role: string;

  @IsString()
  @ApiProperty()
  phoneNumber: string;

  @IsString()
  @ApiProperty({
    required: false,
    description:
      'Delivery Fleet ID  pass here when first login in merchant app if any delivery fleet is created before login.',
  })
  @IsOptional()
  deliveryId: string;
}
