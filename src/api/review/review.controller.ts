import { Body, Controller, Delete, Get, Param, Post } from '@nestjs/common';
import { ReviewService } from './review.service';
import { Authorization, CurrentUser } from 'src/common';
import { ReviewDto } from './dto/review.dto';

@Controller('reviews')
export class ReviewController {
  constructor(private readonly reviewService: ReviewService) {}

  @Authorization()
  @Get('by-storeId/:id')
  async getByStoreId(@Param('id') storeId: string) {
    return await this.reviewService.getByStoreId(storeId);
  }

  @Authorization()
  @Post(':productId/:storeId')
  async create(
    @Param('productId') productId: string,
    @Param('storeId')
    storeId: string,
    @Body() dto: ReviewDto,
    @CurrentUser('id') userId: string,
  ) {
    return await this.reviewService.create(userId, productId, storeId, dto);
  }

  @Authorization()
  @Delete(':id')
  async delete(@Param('id') id: string, @CurrentUser('id') userId: string) {
    return await this.reviewService.delete(id, userId);
  }
}
