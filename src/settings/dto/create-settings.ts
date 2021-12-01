import { IsString, IsEmail, IsNotEmpty, IsBoolean } from 'class-validator';
import { ApiProperty,ApiParam } from '@nestjs/swagger';

export class CreateSettingsDto {
   

    @IsString()
    @IsNotEmpty()
    @ApiProperty()
    column_key: string;
  
    

    @IsString()
    @IsNotEmpty()
    @ApiProperty()
    column_value: string;

    
}