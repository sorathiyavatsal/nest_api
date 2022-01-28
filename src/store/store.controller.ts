import { Controller, Post, UseGuards, Request, Get } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiBearerAuth, ApiBody, ApiConsumes, ApiSecurity, ApiTags } from '@nestjs/swagger';
import { Roles } from 'src/auth/roles.decorator';
import { StoreService } from "./store.service"

@Controller('store')
@ApiTags('store')
@ApiBearerAuth()
@ApiSecurity('api_key')
export class StoreController {
    constructor(private StoreService: StoreService) { }

    @Get('/all')
    @UseGuards(AuthGuard('jwt'))
    @Roles('ADMIN')
    async getAllStore(@Request() request) {
        return await this.StoreService.getAllStore();
    }

    @Post('/add')
    @UseGuards(AuthGuard('jwt'))
    @ApiBody({
        schema: {
            type: 'object',
            properties: {
                profilePic: {
                    type: 'string',
                    format: 'binary',
                },
                Name: {
                    type: 'string'
                },
                Gender: {
                    type: 'string'
                },
                dateOfBirth: {
                    type: 'string'
                },
                shopName: {
                    type: 'string'
                },
                shopAddress: {
                    type: 'string'
                },
                shop_Lat_Long: {
                    type: 'string'
                },
                sell: {
                    type: 'string'
                },
                aadhar_card_pic: {
                    type: 'string',
                    format: 'binary',
                },
                aadhar_card_number: {
                    type: 'string'
                },
                pan_card_pic: {
                    type: 'string',
                    format: 'binary',
                },
                pan_card_number: {
                    type: 'string'
                },
                gst_no: {
                    type: 'string'
                },
                store_licences_pic: {
                    type: 'string',
                    format: 'binary',
                },
                store_licences_number: {
                    type: 'string'
                },
                service_area_Lat_Long: {
                    type: 'string'
                },
                service_area_address: {
                    type: 'string'
                },
                bank_account_no: {
                    type: 'string'
                },
                bank_account_holder_name: {
                    type: 'string'
                },
                bank_name: {
                    type: 'string'
                },
                ifsc_code: {
                    type: 'string'
                },
                phone_number: {
                    type: 'array'
                },
                primary_language: {
                    type: 'array'
                },
                secondary_language: {
                    type: 'array'
                }
            },
        },
    })
    @ApiConsumes('multipart/form-data', 'application/json')
    async postStore(@Request() request) {
        return await this.StoreService.postStore();
    }
}
