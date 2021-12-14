import { IsString,  IsEmail, IsNotEmpty, IsBoolean, IsNumber,  IsDateString, IsDate } from 'class-validator';
import { ApiProperty,ApiParam} from '@nestjs/swagger';


export class DeliveryDistanceUpdateDto {
    @IsNumber()
    @IsNotEmpty()
    @ApiProperty()
    loc: object;


   

    
}