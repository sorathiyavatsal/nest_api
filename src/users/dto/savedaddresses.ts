import { IsNumber, IsString, IsEmail, IsNotEmpty, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class savedAddressesDto {
  @IsString()
  @ApiProperty({ 
    required: false,
    description: "Add Id For Edit Existing saved address"
  })
  savedAddressId: string;

  @IsNumber()
  @IsNotEmpty()
  @ApiProperty()
  lat: number;

  @IsNumber()
  @IsNotEmpty()
  @ApiProperty()
  lng: number;

  @IsString()
  @ApiProperty({
    required: false,
    description:
      'Save Delivery Addresses.',
  })
  address: string;

  @IsString()
  @ApiProperty({
    required: false,
    description:
      'Delivery Addresses Land Mark.',
  })
  landMark: string;

  @IsString()
  @ApiProperty({ required: false })
  fullName: string;

  @IsString()
  @ApiProperty({ required: false })
  phoneNumber: string;

  @IsString()
  @ApiProperty({ required: false })
  label: string;
}
