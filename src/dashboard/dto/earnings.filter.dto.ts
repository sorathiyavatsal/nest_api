import { IsString, IsEmail, IsNotEmpty, IsBoolean } from 'class-validator';
import { ApiProperty, ApiParam } from '@nestjs/swagger';

export class earningsFilterDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    required: true,
    description: 'if you want week pass start date of the week',
  })
  startDate: Date;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    required: true,
    description: 'if you want week pass end date of the week',
  })
  endDate: Date;
}
