import { Controller, SetMetadata, UploadedFiles, Request, Get, Post, Delete, Body, Put, ValidationPipe, Query, Req, Res, Param, UseGuards, UseInterceptors, UploadedFile } from '@nestjs/common';
import { ApiTags, ApiProperty, ApiSecurity, ApiBearerAuth, ApiParam, ApiConsumes, ApiOperation } from '@nestjs/swagger';
import { PartnersService } from "./partners.service"
import { AuthGuard } from '@nestjs/passport';
import { Roles } from '../auth/roles.decorator';
import { ApiBody } from '@nestjs/swagger';
import { FileInterceptor, FilesInterceptor, FileFieldsInterceptor } from '@nestjs/platform-express'

@Controller('partners')
@ApiTags('Partners')
@ApiBearerAuth()
@ApiSecurity('api_key')
export class PartnersController {
    constructor(private PartnersService: PartnersService) { }

    @Get('/')
    @UseGuards(AuthGuard('jwt'))
    @Roles('ADMIN')
    async getAllPartners(@Request() request) {
        return await this.PartnersService.getAllPartners();
    }

    @Post('/add')
    @UseGuards(AuthGuard('jwt'))
    @ApiBody({
        schema: {
            type: 'object',
            properties: {
                Name: {
                    type: 'string',
                },
                Contact: {
                    type: 'string',
                },
                Address: {
                    type: 'array',
                    items: {
                        type: 'string',
                    },
                },
                ZipCode: {
                    type: 'number'
                },
                DA: {
                    type: 'number'
                },
                AllocatedZipCodes: {
                    type: 'array',
                    items: {
                        type: 'string',
                    },
                }
            },
        },
    })
    @ApiConsumes('multipart/form-data')
    async postPartners(@Request() request) {
        return await this.PartnersService.postPartners();
    }
}
