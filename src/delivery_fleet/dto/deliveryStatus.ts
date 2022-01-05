import { IsString, IsEmail, IsNotEmpty, IsBoolean, IsNumber, IsDateString, IsDate } from 'class-validator';
import { ApiProperty, ApiParam } from '@nestjs/swagger';


export class DeliveryStatusDto {
    @IsNumber()
    @IsNotEmpty()
    @ApiProperty()
    invoiceStatus: string;
    @IsNumber()
    @IsNotEmpty()
    @ApiProperty({required:false,description:'OTP is need when status is progress and complete'})
    otp: string;
    @IsNumber()
    @IsNotEmpty()
    @ApiProperty({description:' you can pass when trip is complete',required:false})
    totalHrs: string;

}