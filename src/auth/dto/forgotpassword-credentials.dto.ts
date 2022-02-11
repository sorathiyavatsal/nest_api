import { IsString, IsEmail, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class ForgotPasswordCredentialsDto {
  @IsString()
  @IsEmail()
  @ApiProperty()
  email: string;
}
