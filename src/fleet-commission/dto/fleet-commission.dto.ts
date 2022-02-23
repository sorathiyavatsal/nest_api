import { IsNumber, IsString, IsNotEmpty, IsBoolean, IsArray } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class wagesDto {
  @IsNumber()
  @ApiProperty({ required: true })
  hoursPerMonth: number;

  @IsNumber()
  @ApiProperty({ required: true })
  dayPerMonth: number;

  @IsNumber()
  @ApiProperty({ required: true })
  amount: number;
}

export class fuelDto {
  @IsNumber()
  @ApiProperty({ required: true })
  price: number;

  @IsNumber()
  @ApiProperty({ required: true })
  kmPerMOnth: number;
}

export class percentageTypeDto {
  @IsBoolean()
  @ApiProperty({ required: true, description: "true If value is in percantage otherwise false" })
  isPercantage: Boolean;

  @IsNumber()
  @ApiProperty({ required: true })
  value: number;
}

export class fleetCommissionDto {
  @IsString()
  @ApiProperty({ required: true })
  name: string;

  @ApiProperty({ type: wagesDto })
  @IsNotEmpty()
  wages: wagesDto;

  @ApiProperty({ type: fuelDto })
  @IsNotEmpty()
  fuel: fuelDto;

  @IsNumber()
  @ApiProperty({ required: false })
  additionalPerKm: number;

  @IsNumber()
  @ApiProperty({ required: false })
  additionalPerHour: number;

  @ApiProperty({ type: percentageTypeDto })
  @IsNotEmpty()
  incentive: percentageTypeDto;

  @ApiProperty({ type: percentageTypeDto })
  @IsNotEmpty()
  surcharge: percentageTypeDto;

  @IsBoolean()
  @ApiProperty({ required: false })
  isRegional: Boolean;

  @IsArray()
  @ApiProperty({ type: Array, required: false })
  zipcodes: [string];

}
