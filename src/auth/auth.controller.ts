import { Controller, SetMetadata, Request,Response,Get, Post, Body, Put, ValidationPipe, Query, Req, Res, Param, UseGuards, UseInterceptors, UploadedFile } from '@nestjs/common';
import { ApiTags, ApiParam, ApiBearerAuth, ApiOperation, ApiSecurity } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { AuthCredentialsDto } from './dto/auth-credentials.dto';
import {UserCredentialsDto} from './dto/user-credentials.dto';
import {ForgotPasswordCredentialsDto} from './dto/forgotpassword-credentials.dto';
import {ResetPasswordCredentialsDto} from './dto/resetpassword-credentials.dto';
import {EmailVerifyCredentialsDto} from './dto/emailVerify-credentials.dto';
import {MangerDeliveryCredentialsDto} from './dto/manager-delivery-credentials.dto'
import { AccountSetupDto } from './dto/account-setup-credentials.dto';
import { AuthGuard } from '@nestjs/passport';
import { User } from "./user.model";
import { userInfo } from 'os';

@Controller('auth')
@ApiTags('Authentification')
@ApiSecurity('api_key')
export class AuthController {
  constructor(private authService: AuthService) {
    
   }

 
  @ApiOperation({ summary: 'Login' })
  @Post('/login')
  async signIn(@Body(ValidationPipe) authCredentialsDto: AuthCredentialsDto,@Request() req) {
    return await this.authService.validateUserByPassword(authCredentialsDto,req);
  }

  @ApiOperation({ summary: 'Add user' })
  @Post('/adduser')
  async signUp(@Body() authCredentialsDto: UserCredentialsDto,@Req() req) {
    return await this.authService.createUser(authCredentialsDto,req);
  }
  
  @ApiOperation({ summary: 'Forgot password' })
  @Post('/forgotpass')
  async forgotPassword(@Body(ValidationPipe) forgotPasswordCredentialsDto: ForgotPasswordCredentialsDto,@Req() req) {
    
    return await this.authService.forgotPassword(forgotPasswordCredentialsDto,req);
  }
  @ApiOperation({ summary: 'Reset password' })
  @Post('/resetpass')
  async verifyTokenByEmailPassword(@Body(ValidationPipe) resetPasswordCredentialsDto:ResetPasswordCredentialsDto) {
    return await this.authService.verifyTokenByEmailPassword(resetPasswordCredentialsDto);
  }

  @ApiOperation({ summary: 'Verify the otp' })
  @Post('/verify/otp')
  async verifyTokenByEmail(@Body(ValidationPipe) emailVerifyCredentialsDto:EmailVerifyCredentialsDto) {
    return await this.authService.verifyTokenByEmail(emailVerifyCredentialsDto);
  }

  
}
