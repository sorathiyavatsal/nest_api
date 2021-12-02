import { IsString, IsEmail, IsNotEmpty, IsBoolean,IsNumber } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class EditPackagingsDto {
    
    @IsString()
    @ApiProperty()
    category: string;
  
    @IsNumber()
    @ApiProperty()
    rate: Number;

    @IsBoolean()
    @IsNotEmpty()
    @ApiProperty()
    activeStatus: boolean;
    
}