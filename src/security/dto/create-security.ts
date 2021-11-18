import { IsString, IsEmail, IsNotEmpty, IsBoolean } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateSecurityDto {
    @IsString()
    @IsNotEmpty()
    @ApiProperty()
    name: string;
  
    @IsEmail()
    @IsNotEmpty()
    @ApiProperty()
    email: string;

    @IsBoolean()
    @IsNotEmpty()
    @ApiProperty()
    activeStatus: boolean;

    
}