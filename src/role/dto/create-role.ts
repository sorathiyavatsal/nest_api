import {
  IsString,
  IsEmail,
  IsArray,
  IsNotEmpty,
  IsBoolean,
  IsNumber,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateRoleDto {
  @IsString()
  @ApiProperty()
  role: string;

  @IsBoolean()
  @IsNotEmpty()
  @ApiProperty()
  activeStatus: boolean;

  @IsArray()
  @IsNotEmpty()
  @ApiProperty()
 permissions: Array<object>;
}
