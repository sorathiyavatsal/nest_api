import { Controller, SetMetadata, Request, Get, Post, Body, Put, ValidationPipe, Query, Req, Res, Param, UseGuards, UseInterceptors, UploadedFile } from '@nestjs/common';
import { ApiTags, ApiSecurity, ApiBearerAuth, ApiParam, ApiOperation } from '@nestjs/swagger';
import { UsersService } from './users.service';
import { AuthGuard } from '@nestjs/passport';
import { User } from "../auth/user.model";
import { userInfo } from 'os';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { Role } from '../auth/role.enum';
import { profileStatusDto } from './dto/useravailable';
import { locationUpdateDto } from './dto/locationupdate';
@Controller('users')
@ApiTags('Users')
@ApiSecurity('api_key')
export class UsersController {
  constructor(private userService: UsersService) { }

  @ApiOperation({ summary: 'All users' })
  @ApiBearerAuth()
 @UseGuards(AuthGuard('jwt'))
  @Roles(Role.ADMIN)
  @Get('/all')
  async getAllUsers(@Request() request) {
    return await this.userService.getAllUsers();
  }

  @ApiOperation({ summary: 'Current user profile' })
  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'))
  @Get('/me')
  async getProfile(@Request() request) {
    const user = request.user;
    return user
  }

  @ApiOperation({ summary: 'user profile' })
  @ApiParam({ name: 'id', required: true })
  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'))
  @Get('/profile/:id')
  async userProfile(@Param() params) {

    return await this.userService.findOneId(params.id);
  }
  @ApiOperation({ summary: 'delivery boy location update' })
  @ApiParam({ name: 'id', required: true })
  @Put('/delivery-boy/location/:id')
  async deliveryBoyUpdateLocation(@Param() params, @Body() locationUpdate: locationUpdateDto, @Req() req) {

    return await this.userService.updateLocation(params.id, locationUpdate);
  }
  @ApiOperation({ summary: 'delivery boy status update' })
  @ApiBearerAuth()
 @UseGuards(AuthGuard('jwt'))
  @ApiParam({ name: 'id', required: true })
  @Put('/delivery-boy/duty/:id')
  async deliveryBoyUpdateStatus(@Param() params, @Body() profileStatus: profileStatusDto, @Req() req) {

    return await this.userService.updateStatus(params.id, profileStatus, req.user);
  }
  @ApiOperation({ summary: 'Admin Approved/Rejected Accounts' })
  @ApiParam({ name: 'id', required: true })
  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt')) 
  @Put('/delivery-boy/status/:id')
  async adminUpdateStatus(@Param() params, @Body() profileStatus: profileStatusDto, @Req() req) {

    return await this.userService.activeAccount(params.id, profileStatus, req.user);
  }
}
