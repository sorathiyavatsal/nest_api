import {
  IsString,
  IsEmail,
  IsNotEmpty,
  IsBoolean,
  IsNumber,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreatePackagesDto {
  @IsString()
  @ApiProperty()
  category: string;

  @IsNumber()
  @ApiProperty()
  from_pack: number;

  @IsNumber()
  @ApiProperty()
  to_pack: number;

  @IsNumber()
  @ApiProperty()
  rate: Number;

  @IsBoolean()
  @IsNotEmpty()
  @ApiProperty()
  activeStatus: boolean;
}
