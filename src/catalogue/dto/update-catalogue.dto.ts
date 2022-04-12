import { IsString, IsNotEmpty, IsBoolean, IsArray } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class updateCatalogueDto {

  @IsBoolean()
  @ApiPropertyOptional({ required: true })
  catalogueStatus: Boolean;

  @IsArray()
  @ApiPropertyOptional()
  @IsNotEmpty()
  catalogueImages: []

  @IsArray()
  @ApiPropertyOptional()
  @IsNotEmpty()
  addon: []
}
