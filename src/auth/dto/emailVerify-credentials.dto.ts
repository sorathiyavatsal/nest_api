import {
  IsString,
  IsOptional,
  IsEmail,
  IsNotEmpty,
  IsEmpty,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class EmailVerifyCredentialsDto {
  @IsString()
  @IsEmail()
  @IsOptional()
  @ApiProperty()
  email: string;

  @IsOptional()
  @IsString()
  @ApiProperty()
  phone: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  code: string;
}
