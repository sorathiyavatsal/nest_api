import {
  IsString,
  IsNotEmpty,
  IsBoolean,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class catalogueDto {
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

  @ApiProperty({ type: Array })
  @IsNotEmpty()
  variants: [];

  @ApiProperty({ type: Array })
  @IsNotEmpty()
  variantoptions: [];
}
