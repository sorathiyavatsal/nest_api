import { IsString, IsEmail, IsNotEmpty, IsBoolean } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreatePackagesDto {
    @IsString()
    @ApiProperty()
    1: string;
  
    @IsString()
    @ApiProperty()
    2: string;

    @IsString()
    @ApiProperty()
    3: string;

    @IsString()
    @ApiProperty()
    4: string;

    @IsString()
    @ApiProperty()
    5: string;

    @IsString()
    @ApiProperty()
    greatethen_5: string;

    @IsString()
    @ApiProperty()
    greaterthanorequalto_10: string;

    
}