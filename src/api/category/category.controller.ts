import { Body, Controller, Delete, Get, HttpCode, Param, Post, Put } from '@nestjs/common';
import { CategoryService } from './category.service';
import { Authorization } from 'src/common';
import { CategoryDto } from './dto/category.dto';

@Controller('categories')
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}

  @Authorization()
  @Get('by-storeId/:id')
  async getByStoreId(@Param('id') storeId: string) {
    return await this.categoryService.getByStoreId(storeId);
  }

  @Authorization()
  @Get('by-id/:id')
  async getById(@Param('id') id: string) {
    return await this.categoryService.getById(id);
  }

  @HttpCode(200)
  @Authorization()
  @Post(':storeId')
  async create(@Param('storeId') storeId: string, @Body() dto: CategoryDto) {
    return await this.categoryService.create(storeId, dto);
  }

  @HttpCode(200)
  @Authorization()
  @Put(':id')
  async update(@Param('id') categoryId: string, @Body() dto: CategoryDto) {
    return await this.categoryService.update(categoryId, dto);
  }

  @HttpCode(200)
  @Authorization()
  @Delete(':id')
  async delete(@Param('id') id: string) {
    return await this.categoryService.delete(id);
  }
}
