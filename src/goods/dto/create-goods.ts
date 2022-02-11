import { IsString, IsNotEmpty, IsBoolean, IsNumber } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateGoodsDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  name: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  svgImage: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  image: string;

  @IsBoolean()
  @IsNotEmpty()
  @ApiProperty()
  activeStatus: boolean;

  @IsNumber()
  @IsNotEmpty()
  @ApiProperty()
  orderNumber: number;
}
