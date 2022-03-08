import {
    IsString,
    IsNotEmpty,
    IsNumber,
    IsArray,
    IsOptional,
    IsObject,
  } from 'class-validator';
  import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
  

  //This is the body of API that we will put data into
  export class CreatePromotionDto {
    @IsString()
    @ApiProperty()
    name: string;
  
    @IsString()
    @ApiProperty()
    description: string;
  
    @IsString()
    @ApiProperty()
    image: string;

    @IsArray()
    @ApiProperty()
    device: Array<string>;

    @IsArray()
    @ApiProperty()
    area: Array<string>;

    @IsString()
    @ApiPropertyOptional()
    promotion_for_coupon: string;

    @IsObject()
    @ApiProperty()
    merchant: object;

    @IsObject()
    @ApiProperty()
    consumer: object;

    @IsObject()
    @ApiProperty()
    da: object;

    @IsString()
    @ApiProperty()
    type: string;

    @IsObject()
    @ApiProperty()
    start_date: string;

    @IsObject()
    @ApiProperty()
    end_date: string;

    @IsObject()
    @ApiProperty()
    placement: object;

    // @IsArray()
    // @ApiProperty()
    // DAs: Array<string>;

    // @IsArray()
    // @ApiProperty()
    // AllocatedZipCodes: Array<number>;
  }
  