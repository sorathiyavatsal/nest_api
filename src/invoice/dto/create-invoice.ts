import { IsString,  IsEmail, IsNotEmpty, IsBoolean, IsNumber,  IsDateString, IsDate } from 'class-validator';
import { ApiProperty,ApiParam} from '@nestjs/swagger';


export class CreateInvoiceDto {
    @IsString()
    @IsNotEmpty()
    @ApiProperty()
    fromAddress: string;
    @IsString()
    @IsNotEmpty()
    @ApiProperty()
    fromZipcode: string;
    @IsString()
    @IsNotEmpty()
    @ApiProperty()
    fromLat: string;
    @IsString()
    @IsNotEmpty()
    @ApiProperty()
    fromLng: string;
    @IsString()
    @IsNotEmpty()
    @ApiProperty()
    fromPhone: string;


  
    @IsString()
    @IsNotEmpty()
    @ApiProperty()
    toAddress: string;
    @IsString()
    @IsNotEmpty()
    @ApiProperty()
    toZipcode: string;
    @IsString()
    @IsNotEmpty()
    @ApiProperty()
    toLat: string;
    @IsString()
    @IsNotEmpty()
    @ApiProperty()
    toLng: string;
    @IsString()
    @IsNotEmpty()
    @ApiProperty()
    toPhone: string;


    @IsString()
    @IsNotEmpty()
    @ApiProperty()
    goods: string;
    
    @IsNumber()
    @IsNotEmpty()
    @ApiProperty()
    numberofPack: number;

    @IsNumber()
    @IsNotEmpty()
    @ApiProperty()
    weightPack: number;

    @IsString()
    @ApiProperty()
    pickupType: string;

    @IsDate()
    @ApiProperty()
    pickupDate: Date;
   
    @IsString()
    @ApiProperty()
    pickupTime: string;
  
   
  

    @IsString()
    @ApiProperty()
    cor: string;
   
    @IsBoolean()
    @IsNotEmpty()
    @ApiProperty()
    deliverChargeType: boolean;

    @IsString()
    @IsNotEmpty()
    @ApiProperty()
    invoiceStatus: string;

    @IsBoolean()
    @IsNotEmpty()
    @ApiProperty()
    activeStatus: boolean;

    

    
}