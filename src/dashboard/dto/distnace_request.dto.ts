import { IsNumber, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class distanceRequestDto {
  @IsNumber()
  @IsNotEmpty()
  @ApiProperty({ required: true })
  radius: number;
}
