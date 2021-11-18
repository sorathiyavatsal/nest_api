import { Template } from './../template.model';
import { IsString, IsEmail, IsNotEmpty, IsBoolean } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateTemplateDto {
    @IsString()
    @IsNotEmpty()
    @ApiProperty()
    name: string;

    @IsString()
    @IsNotEmpty()
    @ApiProperty()
    template:Template;

    @IsBoolean()
    @IsNotEmpty()
    @ApiProperty()
    activeStatus:boolean;

    
}