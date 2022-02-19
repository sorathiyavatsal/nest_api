import {
    IsString,
    IsNotEmpty,
    IsNumber,
    IsArray,
    IsOptional,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class EditPartnerDto {
    @IsString()
    @ApiPropertyOptional()
    Name: string;

    @IsNumber()
    @ApiPropertyOptional()
    Contact: number;

    @IsString()
    @ApiPropertyOptional()
    Street: string;

    @IsString()
    @ApiPropertyOptional()
    Street2: string;

    @IsString()
    @ApiPropertyOptional()
    Landmark: string;

    @IsString()
    @ApiPropertyOptional()
    City: string;

    @IsString()
    @ApiPropertyOptional()
    State: string;

    @IsNumber()
    @ApiPropertyOptional()
    ZipCode: number;

    @IsArray()
    @ApiPropertyOptional()
    DAs: Array<string>;

    @IsArray()
    @ApiPropertyOptional()
    AllocatedZipCodes: Array<number>;
}
