import {
  IsString,
  IsEmail,
  IsNotEmpty,
  IsBoolean,
  IsNumber,
  IsDateString,
  IsDate,
} from 'class-validator';
import { ApiProperty, ApiParam } from '@nestjs/swagger';

export class DeliveryStatusDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  invoiceStatus: string;
  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    required: false,
    description: 'OTP is need when status is progress and complete',
  })
  otp: string;
  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    description: ' you can pass when trip is complete',
    required: false,
  })
  totalHrs: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    description: ' you can pass when trip is complete',
    required: false,
  })
  reason: string;
}
