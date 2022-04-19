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
    FileFieldsInterceptor([{ name: 'profilePhoto', maxCount: 1 }], {
      storage: diskStorage({
        destination: './public/uploads/profile',
        filename: function (req, file, cb) {
          let extArray = file.mimetype.split('/');
          let extension = extArray[extArray.length - 1];
          cb(null, file.fieldname + '-' + Date.now() + '.' + extension);
        },
      }),
    }),
  )
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        email: { type: 'string' },
        emailVerified: { type: 'boolean' },
        gender: {
          type: 'string',
          description:
            "you can pass any one the value ['Male','Female','Others']",
        },
        dateofbirth: { type: 'string' },
        profilePhoto: { type: 'string', format: 'binary' },
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

    return await this.userService.addprofile(request.body, request.user);
  }

  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth()
  @ApiConsumes('multipart/form-data', 'application/json')
  @Put('/update')
  @ApiQuery({ name: 'id', type: 'string', required: true })
  @UseInterceptors(
    FileFieldsInterceptor(
      [
        { name: 'profile_photo', maxCount: 1 },
        { name: 'store_license_image', maxCount: 5 },
        { name: 'vehicle_image', maxCount: 5 },
        { name: 'store_image', maxCount: 5 },
        { name: 'aadhar_card_image', maxCount: 2 },
        { name: 'gst_image', maxCount: 2 },
        { name: 'driving_card_image', maxCount: 2 },
        { name: 'pan_card_image', maxCount: 2 },
        { name: 'food_license_image', maxCount: 5 },
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
        gender: {
          type: 'string',
          description:
            "you can pass any one the value ['Male','Female','Others']",
        },
        dob: { type: 'string', description: 'DOB example value 1988-12-12' },
        fullName: { type: 'string' },
        shop_name: {
          type: 'string',
          description: 'required only merchant and partner profile',
        },
        shop_address: {
          type: 'string',
          description: 'required only merchant and partner profile',
        },
        shop_located_at: {
          type: 'string',
          description: 'required shop lat long',
        },
        sell_items: {
          type: 'array',
          items: {
            type: 'string',
          },
          description: 'required items that sell buy shop',
        },
        adharcard_no: { type: 'string' },
        pancard_no: { type: 'string' },
        gst_no: {
          type: 'string',
          description: 'required only merchant and partner profile',
        },
        gst_image: {
          description: 'required only merchant and partner profile',
          type: 'array',
          items: {
            type: 'string',
            format: 'binary',
          },
        },
        bank_details: {
          type: 'object',
          description: 'required for all profile',
        },
        driving_card: {
          type: 'string',
          description: 'required only DA profile',
        },
        vehicle_no: { type: 'string', description: 'required only DA profile' },
        vehicle_type: {
          type: 'string',
          description: 'required only DA profile',
        },
        store_license: {
          type: 'string',
          description: 'required only merchant profile',
        },
        store_license_image: {
          type: 'array',
          description: 'required only merchant profile',
          items: {
            type: 'string',
            format: 'binary',
          },
        },
        food_license: {
          type: 'string',
          description: 'required only merchant profile',
        },
        food_license_image: {
          type: 'array',
          description: 'required only merchant profile',
          items: {
            type: 'string',
            format: 'binary',
          },
        },
        services_area: {
          type: 'array',
          description: 'required only merchant and partner profile',
          items: {
            type: 'string',
          },
        },
        profile_photo: {
          type: 'string',
          format: 'binary',
        },
        vehicle_image: {
          description: 'required only DA profile',
          type: 'array',
          items: {
            type: 'string',
            format: 'binary',
          },
        },
        store_image: {
          description: 'required only merchant profile',
          type: 'array',
          items: {
            type: 'string',
            format: 'binary',
          },
        },
        aadhar_card_image: {
          type: 'array',
          items: {
            type: 'string',
            format: 'binary',
          },
        },
        driving_card_image: {
          description: 'required only DA profile',
          type: 'array',
          items: {
            type: 'string',
            format: 'binary',
          },
        },
        pan_card_image: {
          type: 'array',
          items: {
            type: 'string',
            format: 'binary',
          },
        },
        partnerId: {
          type: 'string',
          description: 'user collection Id and required only DA profile',
        },
        email: {
            type: 'string'
        },
        emailVerified: {
            type: 'string'
        },
        dateofbirth: {
            type: 'string'
        },
        address: {
            type: 'string'
        },
        phoneNumber: {
            type: 'string'
        },
        role: {
            type: 'string'
        },
        verifyType: {
            type: 'string'
        },
        liveStatus: {
            type: 'string'
        },
        phoneVerified: {
            type: 'string'
        },
        permissions: {
            type: 'string'
        },
        loc: {
            type: 'string'
        },
        activeStatus: {
            type: 'string'
        },
        verifyStatus: {
            type: 'string'
        },
      },
    },
  })
  @ApiConsumes('multipart/form-data', 'application/json')
  @ApiOperation({ summary: 'Merchant/Delivery boy add onboarding data' })
  async updateProfile(
    @Query() query,
    @UploadedFiles() files,
    @Request() request,
  ) {
    let responsedata = [];
    if (files.profile_photo && files.profile_photo.length > 0) {
      for (let i = 0; i < files.profile_photo.length; i++) {
        responsedata.push(files.profile_photo[i].path);
      }
      files.profile_photo = responsedata;
    }
    responsedata = [];
    if (files.store_license_image) {
      for (let i = 0; i < files.store_license_image.length; i++) {
        responsedata.push(files.store_license_image[i].path);
      }
      files.store_license_image = responsedata;
    }
    responsedata = [];
    if (files.vehicle_image) {
      for (let i = 0; i < files.vehicle_image.length; i++) {
        responsedata.push(files.vehicle_image[i].path);
      }
      files.vehicle_image = responsedata;
    }
    responsedata = [];
    if (files.store_image) {
      for (let i = 0; i < files.store_image.length; i++) {
        responsedata.push(files.store_image[i].path);
      }
      files.store_image = responsedata;
    }
    responsedata = [];
    if (files.aadhar_card_image) {
      for (let i = 0; i < files.aadhar_card_image.length; i++) {
        responsedata.push(files.aadhar_card_image[i].path);
      }
      files.aadhar_card_image = responsedata;
    }
    responsedata = [];
    if (files.gst_image) {
      for (let i = 0; i < files.gst_image.length; i++) {
        responsedata.push(files.gst_image[i].path);
      }
      files.gst_image = responsedata;
    }
    responsedata = [];
    if (files.driving_card_image) {
      for (let i = 0; i < files.driving_card_image.length; i++) {
        responsedata.push(files.driving_card_image[i].path);
      }
      files.driving_card_image = responsedata;
    }
    responsedata = [];
    if (files.pan_card_image) {
      for (let i = 0; i < files.pan_card_image.length; i++) {
        responsedata.push(files.pan_card_image[i].path);
      }
      files.pan_card_image = responsedata;
    }

    return await this.userService.updateProfile(query.id, files, request.body);
  }
}
