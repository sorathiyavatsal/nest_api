import {
    IsDate,
    IsString,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateStoreDto {
    @IsString()
    @ApiProperty()
    Name: string;

    @IsString()
    @ApiProperty()
    profilePic: BinaryData;

    @IsString()
    @ApiProperty()
    Gender: string;
    
    @IsDate()
    @ApiProperty()
    dateOfBirth: Date;

    @IsString()
    @ApiProperty()
    shopName: string;

    @IsString()
    @ApiProperty()
    shopAddress: string;

    @IsString()
    @ApiProperty()
    shop_Lat_Long: string;

    @IsString()
    @ApiProperty()
    sell: string;

    @IsString()
    @ApiProperty()
    aadhar_card_pic: BinaryData;

    @IsString()
    @ApiProperty()
    aadhar_card_number: string;

    @IsString()
    @ApiProperty()
    pan_card_pic: BinaryData;

    @IsString()
    @ApiProperty()
    pan_card_number: string;

    @IsString()
    @ApiProperty()
    gst_no: string;

    @IsString()
    @ApiProperty()
    store_licences_pic: BinaryData;

    @IsString()
    @ApiProperty()
    store_licences_number: string;

    @IsString()
    @ApiProperty()
    service_area_Lat_Long: string;

    @IsString()
    @ApiProperty()
    service_area_address: string;

    @IsString()
    @ApiProperty()
    bank_account_no: string;

    @IsString()
    @ApiProperty()
    bank_account_holder_name: string;

    @IsString()
    @ApiProperty()
    bank_name: string;

    @IsString()
    @ApiProperty()
    ifsc_code: string;

    @IsString()
    @ApiProperty()
    phone_number: Array<string>;

    @IsString()
    @ApiProperty()
    primary_language: Array<string>;

    @IsString()
    @ApiProperty()
    secondary_language: Array<string>;
}
