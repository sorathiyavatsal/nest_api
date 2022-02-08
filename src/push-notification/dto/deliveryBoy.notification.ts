import { IsString,  IsEmail, IsNotEmpty, IsBoolean, IsNumber,  IsDateString, IsDate } from 'class-validator';
import { ApiProperty,ApiParam} from '@nestjs/swagger';


export class DeliveryBoyNotificationDto {
    @IsNumber()
    @IsNotEmpty()
    @ApiProperty()
    fromLat: number;

    @IsNumber()
    @IsNotEmpty()
    @ApiProperty()
    fromLng: number;
}