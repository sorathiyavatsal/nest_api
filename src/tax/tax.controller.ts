import { Controller, Post, UseGuards, Request, Get } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiBearerAuth, ApiBody, ApiConsumes, ApiSecurity, ApiTags } from '@nestjs/swagger';
import { Roles } from 'src/auth/roles.decorator';
import { TaxService } from "./tax.service"

@Controller('tax')
@ApiTags('Tax')
@ApiBearerAuth()
@ApiSecurity('api_key')
export class TaxController {
    constructor(private TaxService: TaxService) { }

    @Post('/add')
    @UseGuards(AuthGuard('jwt'))
    @ApiBody({
        schema: {
            type: 'object',
            properties: {
                tax: {
                    type: 'string',
                },
                flat_tax: {
                    type: 'string'
                },
                tax_name: {
                    type: 'string'
                },
            },
        },
    })
    @ApiConsumes('multipart/form-data', 'application/json')
    async postTax(@Request() request) {
        return await this.TaxService.postTax();
    }
}
