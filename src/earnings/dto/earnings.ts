import {
    IsArray,
    IsDate,
    IsNotEmpty,
    IsNumber,
    IsObject,
    IsString,
  } from 'class-validator';
  import { ApiProperty, ApiParam } from '@nestjs/swagger';
  import { ObjectId } from 'mongoose';
  
  export class EarningDto {
    @IsString()
    @IsNotEmpty()
    @ApiProperty()
    JobId: String;

    @IsString()
    @IsNotEmpty()
    @ApiProperty()
    deliveryBoyId: String;

    @IsNumber()
    @IsNotEmpty()
    @ApiProperty()
    workedHours: Number;

    @IsNumber()
    @IsNotEmpty()
    @ApiProperty()
    travelledKMs: Number

    @IsNumber()
    @IsNotEmpty()
    @ApiProperty()
    amount: Number

    @IsString()
    @IsNotEmpty()
    @ApiProperty()
    startDateTime: String;

    @IsString()
    @IsNotEmpty()
    @ApiProperty()
    endDateTime: String;


    @IsString()
    @IsNotEmpty()
    @ApiProperty()
    settlmentId: String;
  }
  