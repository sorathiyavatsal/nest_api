import { IsString, IsEmail, IsNotEmpty, IsBoolean } from 'class-validator';
import { ApiProperty,ApiParam } from '@nestjs/swagger';

export class EditCategoryDto {
   
   

    @IsString()
    @IsNotEmpty()
    @ApiProperty()
    name: string;
  
    

    @IsString()
    @IsNotEmpty()
    @ApiProperty()
    image: string;
   
    @IsBoolean()
    @IsNotEmpty()
    @ApiProperty()
    activeStatus: boolean;
    
}