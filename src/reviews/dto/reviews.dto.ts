import { IsNumber, IsString, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class reviewsDto {
  @IsNumber()
  @ApiProperty({ required: true })
  rating: number;

  @IsString()
  @ApiProperty({ required: true })
  @IsNotEmpty()
  reviewedBy: string;

  @IsNotEmpty()
  @ApiProperty()
  reviewto: string;

  @IsString()
  @ApiProperty({ required: true, enum: ['store', 'product', 'user'] })
  @IsNotEmpty()
  reviewType: string;

  @IsString()
  @ApiProperty({ required: true })
  @IsNotEmpty()
  comment: string;
}
