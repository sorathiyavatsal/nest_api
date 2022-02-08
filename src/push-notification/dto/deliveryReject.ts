import { IsString,  IsEmail, IsNotEmpty, IsBoolean, IsNumber,  IsDateString, IsDate } from 'class-validator';
import { ApiProperty,ApiParam} from '@nestjs/swagger';


export class DeliveryBoyRejectDto {
    @IsString()
    @IsNotEmpty()
    @ApiProperty()
    id: string;
}