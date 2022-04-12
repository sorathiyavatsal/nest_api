import { IsString, IsNotEmpty, IsBoolean, IsArray } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class catalogueDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({ required: true })
  catalogueId: String;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({ required: true })
  productId: String;

  @IsString()
  @ApiProperty({ required: true })
  @IsNotEmpty()
  storeId: String;

  @IsBoolean()
  @ApiProperty({ required: true })
  catalogueStatus: Boolean;

  @IsString()
  @ApiProperty()
  @IsNotEmpty()
  variants: String;

  @IsArray()
  @ApiProperty()
  @IsNotEmpty()
  catalogueImages: []

  @IsArray()
  @ApiProperty()
  @IsNotEmpty()
  addon: []
}
