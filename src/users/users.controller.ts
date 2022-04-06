import {
  Controller,
  SetMetadata,
  Request,
  Get,
  Post,
  Body,
  Put,
  ValidationPipe,
  Query,
  Req,
  Res,
  Param,
  UseGuards,
  UseInterceptors,
  UploadedFile,
  UploadedFiles,
} from '@nestjs/common';
import {
  ApiTags,
  ApiSecurity,
  ApiBearerAuth,
  ApiParam,
  ApiOperation,
  ApiConsumes,
  ApiQuery,
  ApiBody,
} from '@nestjs/swagger';
import { UsersService } from './users.service';
import { AuthGuard } from '@nestjs/passport';
import { User } from '../auth/user.model';
import { userInfo } from 'os';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { Role } from '../auth/role.enum';
import { profileStatusDto } from './dto/useravailable';
import { locationUpdateDto } from './dto/locationupdate';
import { savedAddressesDto } from './dto/savedaddresses';
import { SendEmailMiddleware } from '../core/middleware/send-email.middleware';
import { userDutyStatusDto } from './dto/userduty';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';

@Controller('users')
@ApiTags('Users')
@ApiSecurity('api_key')
export class UsersController {
  constructor(
    private sendEmailMiddleware: SendEmailMiddleware,
    private userService: UsersService,
  ) {}

  @ApiOperation({ summary: 'All users' })
  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'))
  //   @Roles(Role.ADMIN)
  @Get('/all')
  @ApiQuery({ name: 'role', type: 'string', enum: Role, required: false })
  @ApiQuery({ name: 'activeStatus', type: 'boolean', required: false })
  @ApiQuery({ name: 'liveStatus', type: 'boolean', required: false })
  @ApiQuery({ name: 'email', type: 'string', required: false })
  @ApiQuery({ name: 'phoneNumber', type: 'string', required: false })
  async getAllUsers(@Request() request, @Query() filter) {
    return await this.userService.getAllUsers(filter);
  }

  @ApiOperation({ summary: 'Current user profile' })
  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'))
  @Get('/me')
  async getProfile(@Request() request) {
    const user = request.user;
    return user;
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
  //   @Roles(Role.DELIVERY)
  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'))
  @ApiConsumes('multipart/form-data', 'application/json')
  @Put('/location/:id')
  async deliveryBoyUpdateLocation(
    @Param() params,
    @Body() locationUpdate: locationUpdateDto,
    @Req() req,
  ) {
    return await this.userService.updateLocation(params.id, locationUpdate);
  }
  @ApiOperation({ summary: 'delivery boy status update' })
  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'))
  //   @Roles(Role.DELIVERY)
  @ApiParam({ name: 'id', required: true })
  @ApiConsumes('multipart/form-data', 'application/json')
  @Put('/delivery-boy/duty/:id')
  async deliveryBoyUpdateStatus(
    @Param() params,
    @Body() profileStatus: userDutyStatusDto,
    @Req() req,
  ) {
    return await this.userService.updateStatus(params.id, profileStatus);
  }

  @ApiOperation({ summary: 'Admin Approved/Rejected Accounts' })
  @ApiParam({ name: 'id', required: true })
  @ApiBearerAuth()
  //   @Roles(Role.ADMIN)
  @UseGuards(AuthGuard('jwt'))
  @ApiConsumes('multipart/form-data', 'application/json')
  @Put('/delivery-boy/status/:id')
  async adminUpdateStatus(
    @Param() params,
    @Body() profileStatus: profileStatusDto,
    @Req() req,
  ) {
    let user = await this.userService.activeAccount(params.id, profileStatus);

    if (user && user.verifyStatus == true) {
      const mailOptions = {
        name: 'ACCOUNT_APPROVED',
        type: 'SMS',
        device: req.headers.OsName || 'ANDROID',
        phone: user.phoneNumber,
      };
      this.sendEmailMiddleware.sendEmailOrSms(mailOptions);

      // this.sendEmailMiddleware.sensSMSdelivery(
      //   'Apple',
      //   user.phoneNumber,
      //   'Byecome verified your account',
      // );
    }
    if (user && user.verifyStatus == false) {
      const mailOptions = {
        name: 'ACCOUNT_REJECTED',
        type: 'SMS',
        device: req.headers.OsName || 'ANDROID',
        phone: user.phoneNumber,
      };
      this.sendEmailMiddleware.sendEmailOrSms(mailOptions);

      // this.sendEmailMiddleware.sensSMSdelivery(
      //   'Apple',
      //   user.phoneNumber,
      //   'Byecome rejected your account',
      // );
    }
    return user;
  }
  @ApiOperation({ summary: 'Add/Edit address' })
  @ApiParam({ name: 'id', required: true })
  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'))
  @ApiConsumes('multipart/form-data', 'application/json')
  @Put('/savedaddress/:id')
  async signupMobileUser(
    @Param() params,
    @Body() savedAddresses: savedAddressesDto,
    @Req() req,
  ) {
    return await this.userService.addEditSavedAddress(
      params.id,
      savedAddresses,
      req.user,
    );
  }

  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth()
  @ApiConsumes('multipart/form-data', 'application/json')
  @Post('/add')
  @UseInterceptors(
    FileFieldsInterceptor(
      [
        { name: 'profilePhoto', maxCount: 1 },
      ],
      {
        storage: diskStorage({
          destination: './public/uploads/profile',
          filename: function (req, file, cb) {
            let extArray = file.mimetype.split('/');
            let extension = extArray[extArray.length - 1];
            cb(null, file.fieldname + '-' + Date.now() + '.' + extension);
          },
        }),
      },
    ),
  )
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        email: { type: 'string' },
        emailVerified: { type: 'boolean' },
        gender: { type: 'string', description: "you can pass any one the value ['Male','Female','Others']", },
        dateofbirth: { type: 'string' },
        profilePhoto: {type: 'string',format: 'binary',},
        address: { type: 'string' },
        phoneNumber: { type: 'string' },
        fullName: { type: 'string' },
        role: { type: 'string' },
        verifyType: { type: 'string' },
        liveStatus: { type: 'boolean' },
        phoneVerified: { type: 'boolean' },
        permissions: { type: 'array' },
        loc: { type: 'array' },
        activeStatus: { type: 'boolean' },
        verifyStatus: { type: 'boolean' },
      },
    },
  })
  @ApiConsumes('multipart/form-data', 'application/json')
  @ApiOperation({ summary: 'Merchant/Delivery boy add onboarding data' })
  async addProfile(@UploadedFiles() files, @Request() request) {
    let responsedata = [];
    if (files.profilePhoto && files.profilePhoto.length > 0) {
      for (let i = 0; i < files.profilePhoto.length; i++) {
        responsedata.push(files.profilePhoto[i].path);
      }
      files.profilePhoto = responsedata;
    }

    request.body.files = files;

    return await this.userService.addprofile(
      request.body,
      request.user,
    );
  }
}
