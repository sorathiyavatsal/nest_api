import { IsString, IsNotEmpty, IsBoolean, IsArray } from 'class-validator';
import { ApiProperty, ApiParam } from '@nestjs/swagger';

export class CreateOrderSettingsDto {
  @IsBoolean()
  @IsNotEmpty()
  @ApiProperty()
  'metaValue.order_switch': boolean;

  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  'metaValue.operation_time': number;

  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  'metaValue.otp_verification_time': number;
}
