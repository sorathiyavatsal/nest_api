import {
  IsString,
  IsOptional,
  IsEmail,
  IsNotEmpty,
  IsEmpty,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { savedAddressesDto } from 'src/users/dto/savedaddresses';

export class OtpVerifyCredentialsDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  userId: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  code: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({})
  deviceId: string;

  @ApiProperty({required: false})
  savedAddress: [savedAddressesDto]
}
