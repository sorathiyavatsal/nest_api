import {
    IsString,
    IsNotEmpty,
    IsBoolean,
    IsArray,
} from 'class-validator';
import { ApiProperty, ApiParam } from '@nestjs/swagger';

export class CreateOrderSettingsDto {
    @IsBoolean()
    @IsNotEmpty()
    @ApiProperty()
    order_switch: boolean;

    @IsString()
    @IsNotEmpty()
    @ApiProperty()
    orderTime: string;

    @IsString()
    @IsNotEmpty()
    @ApiProperty()
    order_verifyTime: string;
}
