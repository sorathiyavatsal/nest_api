import { IsString, IsEmail, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class MangerDeliveryCredentialsDto {
    
    @IsString()
    @IsNotEmpty()
    @ApiProperty()
    verifyType:string;

    @IsString()
    @ApiProperty()
    role: string;

    @IsString()
    @ApiProperty()
    phoneNumber: string;

    @IsString()
    @ApiProperty()
    deliveryId: string;
}