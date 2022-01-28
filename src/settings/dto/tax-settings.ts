import {
    IsString,
    IsEmail,
    IsNotEmpty,
    IsBoolean,
    IsArray,
} from 'class-validator';
import { ApiProperty, ApiParam } from '@nestjs/swagger';

export class CreateTaxSettingsDto {
    @IsBoolean()
    @IsNotEmpty()
    @ApiProperty()
    price_entry_with_tax: boolean;

    @IsString()
    @IsNotEmpty()
    @ApiProperty()
    calculate_tax: string;

    @IsString()
    @IsNotEmpty()
    @ApiProperty()
    shipping_tax_class: string;

    @IsArray()
    @IsNotEmpty()
    @ApiProperty()
    additional_tax_class: [];

    @IsBoolean()
    @IsNotEmpty()
    @ApiProperty()
    rounded_tax: boolean;

    @IsString()
    @IsNotEmpty()
    @ApiProperty()
    shop_display_price: string;

    @IsString()
    @IsNotEmpty()
    @ApiProperty()
    cart_display_price: string;

    @IsString()
    @IsNotEmpty()
    @ApiProperty()
    display_price_suffix: string;

    @IsString()
    @IsNotEmpty()
    @ApiProperty()
    display_tax_total: string;
}
