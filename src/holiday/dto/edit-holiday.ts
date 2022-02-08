import { IsString, IsEmail, IsNotEmpty, IsBoolean,IsNumber } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class EditHolidaysDto {
    
    @IsString()
    @ApiProperty()
    name: string;
  
    @IsString()
    @ApiProperty()
    fromDate: string;

    @IsString()
    @ApiProperty()
    toDate: string;

    @IsBoolean()
    @IsNotEmpty()
    @ApiProperty()
    activeStatus: boolean;
    
}