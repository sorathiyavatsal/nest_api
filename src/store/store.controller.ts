import {
  Controller,
  Post,
  UseGuards,
  Request,
  Get,
  UseInterceptors,
  Response,
  UploadedFiles,
  Param,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import {
  FileFieldsInterceptor,
} from '@nestjs/platform-express';
import {
  ApiBearerAuth,
  ApiBody,
  ApiConsumes,
  ApiParam,
  ApiSecurity,
  ApiTags,
} from '@nestjs/swagger';
import { Roles } from 'src/auth/roles.decorator';
import { StoreService } from './store.service';
import { diskStorage } from 'multer';

@Controller('store')
@ApiTags('Store')
@ApiBearerAuth()
@ApiSecurity('api_key')
export class StoreController {
  constructor(private StoreService: StoreService) {}

  @Get('/all')
  @UseGuards(AuthGuard('jwt'))
  async getAllStore(@Response() response) {
    response.json(await this.StoreService.getAllStore());
  }

  @Get('/:id')
  @UseGuards(AuthGuard('jwt'))
  @ApiParam({ name: 'id', required: true })
  async getStore(@Param() params, @Response() response) {
    response.json(await this.StoreService.getStore(params.id));
  }

  @Post('/add')
  @UseGuards(AuthGuard('jwt'))
  @UseInterceptors(
    FileFieldsInterceptor(
      [
        { name: 'storeImage', maxCount: 1 },
        { name: 'merchant_profilePic', maxCount: 1 },
        { name: 'aadhar_card_pic', maxCount: 1 },
        { name: 'pan_card_pic', maxCount: 1 },
        { name: 'store_licences_pic', maxCount: 1 },
        { name: 'licences_pic', maxCount: 1 },
      ],
      {
        storage: diskStorage({
          destination: './public/uploads/documents',
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
        shopName: {
          type: 'string',
        },
        storeImage: {
          type: 'string',
          format: 'binary',
        },
        merchant_profilePic: {
          type: 'string',
          format: 'binary',
        },
        merchant_name: {
          type: 'string',
        },
        merchant_gender: {
          type: 'string',
        },
        merchant_dateOfBirth: {
          type: 'string',
        },
        merchant_phoneNumber: {
          type: 'string',
        },
        merchant_Address: {
          type: 'string',
        },
        shopAddress: {
          type: 'string',
        },
        shop_Lat_Long: {
          type: 'string',
        },
        category: {
          type: 'string',
        },
        aadhar_card_pic: {
          type: 'string',
          format: 'binary',
        },
        aadhar_card_number: {
          type: 'string',
        },
        pan_card_pic: {
          type: 'string',
          format: 'binary',
        },
        pan_card_number: {
          type: 'string',
        },
        gst_no: {
          type: 'string',
        },
        store_licences_pic: {
          type: 'string',
          format: 'binary',
        },
        store_licences_number: {
          type: 'string',
        },
        licences_pic: {
          type: 'string',
          format: 'binary',
          description: 'iffsc and drug licence',
        },
        licences_number: {
          type: 'string',
        },
        service_area_zipcode: {
          type: 'array',
        },
        bank_account_no: {
          type: 'string',
        },
        bank_account_holder_name: {
          type: 'string',
        },
        bank_name: {
          type: 'string',
        },
        ifsc_code: {
          type: 'string',
        },
        delegate_access: {
          type: 'array',
        },
        primary_language: {
          type: 'string',
        },
        secondary_language: {
          type: 'string',
        },
        store_timing: {
          type: 'array',
        },
      },
    },
  })
  @ApiConsumes('multipart/form-data', 'application/json')
  async postStore(@Request() request, @UploadedFiles() files) {
    const data = await this.StoreService.postStore(files, request);
    return data;
  }
}
