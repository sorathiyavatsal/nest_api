// import {
//     IsString,
//     IsNotEmpty,
//     IsNumber,
//     IsArray,
//     IsOptional,
//   } from 'class-validator';
//   import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
  
//   export class CreatePromotionDto {
//     @IsString()
//     @ApiProperty()
//     name: string;
  
//     @IsNumber()
//     @ApiProperty()
//     Contact: number;
  
//     @IsString()
//     @IsNotEmpty()
//     @ApiProperty()
//     Street: string;

//     @IsString()
//     @ApiPropertyOptional()
//     Street2: string;

//     @IsString()
//     @ApiProperty()
//     Landmark: string;

//     @IsString()
//     @ApiProperty()
//     City: string;

//     @IsString()
//     @ApiProperty()
//     State: string;

//     @IsNumber()
//     @ApiProperty()
//     ZipCode: number;

//     @IsArray()
//     @ApiProperty()
//     DAs: Array<string>;

//     @IsArray()
//     @ApiProperty()
//     AllocatedZipCodes: Array<number>;
//   }
  