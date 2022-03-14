import {
  Controller,
  UploadedFiles,
  Request,
  Get,
  Post,
  Put,
  Param,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import {
  ApiTags,
  ApiProperty,
  ApiSecurity,
  ApiBearerAuth,
  ApiParam,
  ApiConsumes,
  ApiOperation,
} from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { UserDataService } from './user-data.service';
import { Roles } from '../auth/roles.decorator';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import { ApiBody } from '@nestjs/swagger';
import { diskStorage } from 'multer';

@Controller('user-data')
@ApiTags('user-data')
@ApiBearerAuth()
@ApiSecurity('api_key')
export class UserDataController {
  constructor(private UserDataService: UserDataService) {}

  @Get('/get-all-profile')
  @UseGuards(AuthGuard('jwt'))
  @Roles('ADMIN')
  async getProfile(@Request() request) {
    return await this.UserDataService.getAllProfile(request.user);
  }

  @UseGuards(AuthGuard('jwt'))
  @ApiParam({ name: 'id', required: true })
  @Get('/profile/:id')
  async getProfileDetail(@Param() params, @Request() request: any) {
    return await this.UserDataService.getProfileDetail(params.id);
  }

  @UseGuards(AuthGuard('jwt'))
  @ApiConsumes('multipart/form-data', 'application/json')
  @Post('/add')
  @UseInterceptors(
    FileFieldsInterceptor(
      [
        { name: 'profile_photo', maxCount: 1 },
        { name: 'store_license_image', maxCount: 5 },
        { name: 'vehicle_image', maxCount: 5 },
        { name: 'store_no_image', maxCount: 5 },
        { name: 'aadhar_card_image', maxCount: 2 },
        { name: 'gst_image', maxCount: 2 },
        { name: 'driving_card_image', maxCount: 2 },
        { name: 'pan_card_image', maxCount: 2 },
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
          description: 'required items that sell buy shop',
        },
        adharcard_no: { type: 'string' },
        pancard_no: { type: 'string' },
        gst_no: {
          type: 'string',
          description: 'required only merchant and partner profile',
        },
        gst_image: {
          type: 'string',
          description: 'required only merchant and partner profile',
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
        job_type: {
          type: 'string',
          description: "you can pass any one the value ['FULLTIME','PARTTIME']",
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
      },
    },
  })
  @ApiConsumes('multipart/form-data', 'application/json')
  @ApiOperation({ summary: 'Merchant/Delivery boy add onboarding data' })
  async addProfile(@UploadedFiles() file, @Request() request) {
    return await this.UserDataService.createProfile(
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
        { name: 'gst_image', maxCount: 2 },
        { name: 'driving_card_image', maxCount: 2 },
        { name: 'pan_card_image', maxCount: 2 },
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
          description: 'required items that sell buy shop',
        },
        adharcard_no: { type: 'string' },
        pancard_no: { type: 'string' },
        gst_no: {
          type: 'string',
          description: 'required only merchant and partner profile',
        },
        gst_image: {
          type: 'string',
          description: 'required only merchant and partner profile',
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
      },
    },
  })
  @ApiConsumes('multipart/form-data', 'application/json')
  @ApiOperation({ summary: 'Merchant/Delivery boy add onboarding data' })
  async updateProfile(
    @Param() params,
    @UploadedFiles() file,
    @Request() request,
  ) {
    return await this.UserDataService.updateProfile(
      params.id,
      file,
      request.body,
      request.user,
    );
  }
}
