import { IsString, IsEmail, IsNotEmpty, IsBoolean } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateCategoryDto {
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

    
}