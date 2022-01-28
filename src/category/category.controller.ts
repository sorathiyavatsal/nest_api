import { Controller, Post, UseGuards, Request, Get } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiBearerAuth, ApiBody, ApiConsumes, ApiSecurity, ApiTags } from '@nestjs/swagger';
import { Roles } from 'src/auth/roles.decorator';
import { CategoryService } from "./category.service"

@Controller('category')
@ApiTags('Category')
@ApiBearerAuth()
@ApiSecurity('api_key')
export class CategoryController {
    constructor(private CategoryService: CategoryService) { }

    @Get('/all')
    @UseGuards(AuthGuard('jwt'))
    @Roles('ADMIN')
    async getAllCategory(@Request() request) {
        return await this.CategoryService.getAllCategory();
    }

    @Post('/add')
    @UseGuards(AuthGuard('jwt'))
    @ApiBody({
        schema: {
            type: 'object',
            properties: {
                categoryName: {
                    type: 'string'
                },
                profilePic: {
                    type: 'string',
                    format: 'binary',
                },
                categoryType: {
                    type: 'string'
                },
                description: {
                    type: 'string'
                },
                parent: {
                    type: 'string'
                },
                status: {
                    type: 'boolean'
                },
            },
        },
    })
    @ApiConsumes('multipart/form-data', 'application/json')
    async postCategory(@Request() request) {
        return await this.CategoryService.postCategory();
    }
}
