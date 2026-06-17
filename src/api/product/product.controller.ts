import { Body, Controller, Delete, Get, Param, Post, Put, Query } from '@nestjs/common';
import { ProductService } from './product.service';
import { Authorization, CurrentUser } from 'src/common';
import { ProductDto } from './dto/product.dto';

@Controller('products')
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @Get()
  async getAll(@Query('searchTerm') searchTerm?: string) {
    return this.productService.getAll(searchTerm);
  }

  @Authorization()
  @Get('by-storeId/:id')
  async getByStoreId(@Param('id') storeId: string) {
    return await this.productService.getByStoreId(storeId);
  }

  @Get('by-id/:id')
  async getById(@Param('id') id: string) {
    return await this.productService.getById(id);
  }

  @Get('by-category/:categoryId')
  async getByCategory(@Param('categoryId') categoryId: string) {
    return this.productService.getByCategory(categoryId);
  }

  @Get('most-popular')
  async getMostPopular() {
    return this.productService.getMostPopular();
  }

  @Get('similar/:productId')
  async getSimilar(@Param('productId') productId: string) {
    return this.productService.getSimilar(productId);
  }

  @Authorization()
  @Post(':storeId')
  async create(
    @Param('storeId') storeId: string,
    @Body() dto: ProductDto,
    @CurrentUser('id') userId: string,
  ) {
    return await this.productService.create(storeId, dto, userId);
  }

  @Authorization()
  @Put(':productId')
  async update(@Param('productId') productId: string, @Body() dto: ProductDto) {
    return await this.productService.update(productId, dto);
  }

  @Authorization()
  @Delete(':productId')
  async delete(@Param('productId') productId: string) {
    return await this.productService.delete(productId);
  }
}
