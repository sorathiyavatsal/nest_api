import { IsString,  IsEmail, IsNotEmpty, IsBoolean, IsNumber,  IsDateString, IsDate } from 'class-validator';
import { ApiProperty,ApiParam} from '@nestjs/swagger';


export class DeliveryDistanceUpdateDto {
    @IsNumber()
    @IsNotEmpty()
    @ApiProperty({description:"type of object loc:{type:'Points'},'coordinates:[lat,lng]"})
    loc: object;


   

    
}