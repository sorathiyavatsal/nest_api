import {
    IsArray,
    IsOptional,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class GetPartnerDto {

    @IsArray()
    @ApiPropertyOptional()
    partner: Array<string>;
}
