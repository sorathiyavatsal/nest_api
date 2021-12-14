import { IsString, IsEmail, IsNotEmpty, IsBoolean,IsNumber,IsDateString, IsDate} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class EditProfileDto {
    
    @IsString()
    @ApiProperty()
    profile_photo: string;

    @IsString()
    @ApiProperty()
    gender: string;

    @IsDate()
    @ApiProperty()
    dob: Date;

    @IsString()
    @ApiProperty()
    shop_name: string;

    @IsString()
    @ApiProperty()
    shop_address: string;

    @IsString()
    @ApiProperty()
    sell_items: string;

    @IsString()
    @ApiProperty()
    adharcard_no: string;

    @IsString()
    @ApiProperty()
    pancard_no: string;

    @IsString()
    @ApiProperty()
    gst_no: string;

    @IsString()
    @ApiProperty()
    bank_account_holer_name: string;

    @IsNumber()
    @ApiProperty()
    bank_account_no:number;

    @IsString()
    @ApiProperty()
    bank_name:string;

    @IsString()
    @ApiProperty()
    ifsc_code:string;
  

    @IsBoolean()
    @IsNotEmpty()
    @ApiProperty()
    activeStatus: boolean;
    
}