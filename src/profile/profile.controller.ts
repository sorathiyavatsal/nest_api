import { Controller, SetMetadata, UploadedFiles,Request, Get, Post, Delete, Body, Put, ValidationPipe, Query, Req, Res, Param, UseGuards, UseInterceptors, UploadedFile } from '@nestjs/common';
import { ProfileService } from "./profile.service"
import { ApiTags, ApiProperty, ApiSecurity, ApiBearerAuth, ApiParam, ApiConsumes, ApiOperation } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { User } from "../auth/user.model";
import { userInfo } from 'os';
import { Roles } from '../auth/roles.decorator';
import { Role } from '../auth/role.enum';
import { CreateProfileDto } from './dto/create-profile';
import { EditProfileDto } from './dto/edit-profile';
import { FileInterceptor, FilesInterceptor, FileFieldsInterceptor } from '@nestjs/platform-express'
import { ApiBody } from '@nestjs/swagger';
import { diskStorage } from 'multer';
import { extname } from 'path';

@Controller('profile')
@ApiTags('Profile')
@ApiBearerAuth()
@ApiSecurity('api_key')
export class ProfileController {
  constructor(private ProfileService: ProfileService) {}

  @Get('/get-all-profile')
  @UseGuards(AuthGuard('jwt'))
  @Roles('ADMIN')
  async getProfile(@Request() request) {
    return await this.ProfileService.getAllProfile(request.user);
  }

  @UseGuards(AuthGuard('jwt'))
  @ApiParam({ name: 'id', required: true })
  @Get('/profile/:id')
  async getProfileDetail(@Param() params, @Request() request: any) {
    return await this.ProfileService.getProfileDetail(params.id);
  }
  @UseGuards(AuthGuard('jwt'))
  @Post('/add')
  @UseInterceptors(
    FileFieldsInterceptor(
      [
        { name: 'profile_photo', maxCount: 1 },
        { name: 'store_license_image', maxCount: 5 },
        { name: 'vehicle_image', maxCount: 5 },
        { name: 'store_no_image', maxCount: 5 },
        { name: 'aadhar_card_image', maxCount: 2 },
        { name: 'driving_card_image', maxCount: 2 },
        { name: 'pan_card_image', maxCount: 2 },
      ],
      {
        storage: diskStorage({
          destination: './public/uploads/profile',
          filename: function(req, file, cb) {
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
        userId: {
          type: 'string',
          description: '_id from the  add user response api',
        },
        gender: {
          type: 'string',
          description:
            "you can pass any one the value ['Male','Female','Others']",
        },
        dob: { type: 'string', description: 'DOB example value 1988-12-12' },
        fullName: { type: 'string' },
        shop_name: {
          type: 'string',
          description: 'required only merchant profile',
        },
        shop_address: {
          type: 'string',
          description: 'required only merchant profile',
        },
        sell_items: {
          type: 'object',
          description: 'required only merchant profile',
        },
        adharcard_no: { type: 'string' },
        pancard_no: { type: 'string' },
        gst_no: {
          type: 'string',
          description: 'required only merchant profile',
        },
        bank_details: {
          type: 'object',
          description: 'required only merchant profile',
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
        job_type: {
          type: 'string',
          description: "you can pass any one the value ['FULLTIME','PARTTIME']",
        },
        store_license: {
          type: 'string',
          description: 'required only merchant profile',
        },
        services_area: {
          type: 'string',
          description: 'required only merchant profile',
        },
        profile_photo: {
          type: 'string',

          format: 'binary',
        },
        store_license_image: {
          type: 'array',
          description: 'required only merchant profile',
          items: {
            type: 'string',
            format: 'binary',
          },
        },
        vehicle_image: {
          description: 'required only DA profile',
          type: 'array',
          items: {
            type: 'string',
            format: 'binary',
          },
        },
        store_no_image: {
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
      },
    },
  })
  @ApiConsumes('multipart/form-data')
  @ApiOperation({ summary: 'Merchant/Delivery boy add onboarding data' })
  async addProfile(@UploadedFiles() file, @Request() request) {
    return await this.ProfileService.createProfile(
      file,
      request.body,
      request.user,
    );
  }
  @UseGuards(AuthGuard('jwt'))
  @ApiParam({ name: 'id', required: true })
  @Put('/update')
  @UseInterceptors(
    FileFieldsInterceptor(
      [
        { name: 'profile_photo', maxCount: 1 },
        { name: 'store_license_image', maxCount: 5 },
        { name: 'vehicle_image', maxCount: 5 },
        { name: 'store_no_image', maxCount: 5 },
        { name: 'aadhar_card_image', maxCount: 2 },
        { name: 'driving_card_image', maxCount: 2 },
        { name: 'pan_card_image', maxCount: 2 },
      ],
      {
        storage: diskStorage({
          destination: './public/uploads/profile',
          filename: function(req, file, cb) {
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
        userId: {
          type: 'string',
          description: '_id from the  add user response api',
        },
        gender: {
          type: 'string',
          description:
            "you can pass any one the value ['Male','Female','Others']",
        },
        dob: { type: 'string', description: 'DOB example value 1988-12-12' },
        fullName: { type: 'string' },
        shop_name: {
          type: 'string',
          description: 'required only merchant profile',
        },
        shop_address: {
          type: 'string',
          description: 'required only merchant profile',
        },
        sell_items: {
          type: 'object',
          description: 'required only merchant profile',
        },
        adharcard_no: { type: 'string' },
        pancard_no: { type: 'string' },
        gst_no: {
          type: 'string',
          description: 'required only merchant profile',
        },
        bank_details: {
          type: 'object',
          description: 'required only merchant profile',
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
        services_area: {
          type: 'string',
          description: 'required only merchant profile',
        },
        profile_photo: {
          type: 'string',

          format: 'binary',
        },
        store_license_image: {
          type: 'array',
          description: 'required only merchant profile',
          items: {
            type: 'string',
            format: 'binary',
          },
        },
        vehicle_image: {
          description: 'required only DA profile',
          type: 'array',
          items: {
            type: 'string',
            format: 'binary',
          },
        },
        store_no_image: {
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
      },
    },
  })
  @ApiConsumes('multipart/form-data')
  @ApiOperation({ summary: 'Merchant/Delivery boy add onboarding data' })
  async updateProfile(
    @Param() params,
    @UploadedFiles() file,
    @Request() request,
  ) {
    return await this.ProfileService.updateProfile(
      params.id,
      file,
      request.body,
      request.user,
    );
  }
}
export const imageFileFilter = (req, file, callback) => {
  if (!file.originalname.match(/\.(jpg|jpeg|png|gif)$/)) {
    return callback(new Error('Only image files are allowed!'), false);
  }
  callback(null, true);
};
