import { Controller, SetMetadata, Request,Response,Get, Post, Body, Put, ValidationPipe, Query, Req, Res, Param, UseGuards, UseInterceptors, UploadedFile } from '@nestjs/common';
import { ApiTags, ApiParam, ApiBearerAuth, ApiOperation, ApiSecurity } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import {EmailVerifyCredentialsDto} from './dto/emailVerify-credentials.dto';
import {MangerDeliveryCredentialsDto} from './dto/manager-delivery-credentials.dto'
import { AccountSetupDto } from './dto/account-setup-credentials.dto';
import { OtpVerifyCredentialsDto } from './dto/otpVerify-credentials.dto';
import { AuthGuard } from '@nestjs/passport';
import { User } from "./user.model";
import { userInfo } from 'os';

@Controller('delivery')
@ApiTags('Mobile Users')
@ApiSecurity('api_key')
export class DeliveryController {
    constructor(private authService: AuthService) { }
@ApiOperation({ description:'You can resend otp also same API',summary: 'Add Manager/Delivery Boy' })
  @Post('/adduser')
  async signupMobileUser(@Body() authCredentialsDto: MangerDeliveryCredentialsDto,@Req() req) {
    return await this.authService.createmobileUser(authCredentialsDto,req);
  }
  @ApiOperation({ summary: 'Otp Verification' })
  @Post('/verify/otp')
  async verifyOtp(@Body() otpverification: OtpVerifyCredentialsDto,@Req() req) {
    return await this.authService.verifyOtpBySms(otpverification,req);
    
  }
  @ApiOperation({ summary: 'Profile Update' })
  @Put('/profile/:id')
  @ApiParam({name: 'id', required: true})
  async profileUpdate(@Param() params,@Body() accountSetupDto: AccountSetupDto,@Req() req) {
    return await this.authService.profileUpdate(params.id,accountSetupDto,req);
  }
}