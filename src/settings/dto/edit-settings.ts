import {
  IsString,
  IsEmail,
  IsNotEmpty,
  IsBoolean,
  IsArray,
} from 'class-validator';
import { ApiProperty, ApiParam } from '@nestjs/swagger';

export class EditSettingsDto {

  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  status: boolean;

  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  zipcode: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  areaName: string;

  value: any;
  type: any;
  name: any;
 
  default_km: any;
  default_km_charge: any;
  addition_charge: any;
  
  default_m: any;
  meter_charge: any;
  default_weather_m: any;
  meter_wether_charge: any;
  static zipcode: any;
  
}
