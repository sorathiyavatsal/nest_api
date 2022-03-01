import {
  IsString,
  IsEmail,
  IsArray,
  IsNotEmpty,
  IsBoolean,
  IsNumber,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class EditRoleDto {
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

 operations:string
 operationAccess:string
 IsEdit:boolean
 IsView:boolean
 IsDelete:boolean
}
