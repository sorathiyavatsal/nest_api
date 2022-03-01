import { Template } from './../template.model';
import { IsString, IsEmail, IsNotEmpty, IsBoolean } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateTemplateDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({ description:  'REGISTER, LOGIN, RESET_PASSWORD, FORGOT_PASSWORD, LOGIN_OTP_VERIFICATION, DELIVERY_FLEET_ORDER_ACCEPTED, DELIVERY_INPROGRESS, DELIVERY_DELIVERED, DELIVERY_PICKUP_OTP, DELIVERY_DELIVERED_OTP, ACCOUNT_APPROVED, ACCOUNT_REJECTED, API_ACCESS_KEY'  })
  name: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  content: string;

  @IsString()
  @ApiProperty({ required: false, description: "For Email type Only" })
  emailSubject: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({ description: "SMS or EMAIL" })
  type: string;

  @IsBoolean()
  @IsNotEmpty()
  @ApiProperty()
  activeStatus: Boolean;
}

export class filterDto {
  @IsBoolean()
  @ApiProperty({ required: false })
  status: Boolean;
}
