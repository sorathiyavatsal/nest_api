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


    @IsNumber()
    @ApiPropertyOptional()
    merchant_monthly_revenue: number;

    @IsNumber()
    @ApiPropertyOptional()
    merchant_number_of_products: number;

    @IsString()
    @ApiPropertyOptional()
    consumer_gender: string;

    @IsNumber()
    @ApiPropertyOptional()
    consumer_age: number;

    @IsString()
    @ApiPropertyOptional()
    consumer_login_statistics: string;

    @IsString()
    @ApiPropertyOptional()
    consumer_product_category: string;

    @IsNumber()
    @ApiPropertyOptional()
    da_hours_worked_day: number;

    @IsNumber()
    @ApiPropertyOptional()
    da_hours_worked_month: number;
    // @IsObject()
    // @ApiProperty()
    // merchant: object;

    // @IsObject()
    // @ApiProperty()
    // consumer: object;

    // @IsObject()
    // @ApiProperty()
    // da: object;

    @IsString()
    @ApiProperty()
    type: string;
    
    @IsNumber()
    @ApiProperty()
    page_number: number;


    @IsNumber()
    @ApiProperty()
    section: string;


    @IsString()
    @ApiProperty()
    start_date: string;

    @IsString()
    @ApiProperty()
    end_date: string;

    

    // @IsObject()
    // @ApiProperty()
    // placement: object;



    // @IsArray()
    // @ApiProperty()
    // DAs: Array<string>;

    // @IsArray()
    // @ApiProperty()
    // AllocatedZipCodes: Array<number>;
  }
  