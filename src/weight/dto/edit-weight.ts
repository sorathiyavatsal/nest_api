import { IsString, IsEmail, IsNotEmpty, IsBoolean } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class EditWeightDto {
    @IsString()
    @ApiProperty()
    0_1: string;
  
    @IsString()
    @ApiProperty()
    1_2: string;

    @IsString()
    @ApiProperty()
    2_3: string;

    @IsString()
    @ApiProperty()
    3_5: string;

    @IsString()
    @ApiProperty()
    greaterthan_5: string;


    @IsString()
    @ApiProperty()
    greaterthanorequalto_10: string;

    
}