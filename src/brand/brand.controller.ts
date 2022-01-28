import { Controller, Post, UseGuards, Request, Get } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiBearerAuth, ApiBody, ApiConsumes, ApiSecurity, ApiTags } from '@nestjs/swagger';
import { Roles } from 'src/auth/roles.decorator';
import { BrandService } from "./brand.service"

@Controller('brand')
@ApiTags('Brand')
@ApiBearerAuth()
@ApiSecurity('api_key')
export class BrandController {
    constructor(private BrandService: BrandService) { }

    @Get('/all')
    @UseGuards(AuthGuard('jwt'))
    @Roles('ADMIN')
    async getAllBrand(@Request() request) {
        return await this.BrandService.getAllBrand();
    }

    @Post('/add')
    @UseGuards(AuthGuard('jwt'))
    @ApiBody({
        schema: {
            type: 'object',
            properties: {
                brandName: {
                    type: 'string'
                },
                brandImage: {
                    type: 'string',
                    format: 'binary',
                },
                description: {
                    type: 'string'
                },
                status: {
                    type: 'boolean'
                },
            },
        },
    })
    @ApiConsumes('multipart/form-data', 'application/json')
    async postBrand(@Request() request) {
        return await this.BrandService.postBrand();
    }
}
