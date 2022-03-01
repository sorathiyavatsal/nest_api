import {
  Controller,
  Get,
  Post,
  Delete,
  Body,
  Put,
  Req,
  Param,
  UseGuards,
  UseInterceptors,
  UploadedFile,
} from '@nestjs/common';
import {
  ApiTags,
  ApiSecurity,
  ApiBearerAuth,
  ApiParam,
  ApiConsumes,
  ApiOperation,
} from '@nestjs/swagger';
import { ReviewsService } from './reviews.service';
import { AuthGuard } from '@nestjs/passport';
import { Roles } from '../auth/roles.decorator';
import { reviewsDto } from './dto/reviews.dto';

@Controller('reviews')
@ApiTags('reviews')
@ApiBearerAuth()
@ApiSecurity('api_key')
export class ReviewsController {
  constructor(private reviewsService: ReviewsService) {}
  @ApiOperation({ summary: 'Get All Reviews' })
  @UseGuards(AuthGuard('jwt'))
  @Roles('ADMIN')
  @Get('/')
  async getAllreviews(@Req() req) {
    return await this.reviewsService.getAllreviews();
  }

  @ApiOperation({ summary: 'Get reviews By Id' })
  @UseGuards(AuthGuard('jwt'))
  @Roles('ADMIN')
  @ApiParam({ name: 'id', required: true })
  @ApiConsumes('multipart/form-data', 'application/json')
  @Get('/:id')
  async getreviewsById(@Param() params, @Req() req) {
    return await this.reviewsService.getreviewsById(params);
  }

  @ApiOperation({ summary: 'Add reviews' })
  @UseGuards(AuthGuard('jwt'))
  @Roles('ADMIN')
  @ApiConsumes('multipart/form-data', 'application/json')
  @Post('/')
  async addNewreviews(@Body() reviews: reviewsDto, @Req() req) {
    return await this.reviewsService.addNewreviews(reviews);
  }

  @ApiOperation({ summary: 'Update reviews' })
  @UseGuards(AuthGuard('jwt'))
  @Roles('ADMIN')
  @ApiParam({ name: 'id', required: true })
  @ApiConsumes('multipart/form-data', 'application/json')
  @Put('/:id')
  async updatereviews(
    @Param() params,
    @Body() reviews: reviewsDto,
    @Req() req,
  ) {
    return await this.reviewsService.updatereviews(params.id, reviews);
  }
}
