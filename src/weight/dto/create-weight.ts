import { IsString, IsEmail, IsNotEmpty, IsBoolean,IsNumber} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateWeightsDto {
    @IsString()
    @ApiProperty()
    name: string;
  
    @IsNumber()
    @ApiProperty()
    from_weight: number;

    @IsNumber()
    @ApiProperty()
    to_weight: number;

    @IsBoolean()
    @IsNotEmpty()
    @ApiProperty()
    activeStatus: boolean;
    
}