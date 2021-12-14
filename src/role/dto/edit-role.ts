import { IsString, IsEmail, IsNotEmpty, IsBoolean,IsNumber } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class EditRoleDto {
    
    @IsString()
    @ApiProperty()
    role: string;
  

    @IsBoolean()
    @IsNotEmpty()
    @ApiProperty()
    activeStatus: boolean;

    
}