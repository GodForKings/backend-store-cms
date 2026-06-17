import { Body, Controller, Delete, Get, HttpCode, Param, Post, Put } from '@nestjs/common';
import { StoreService } from './store.service';
import { Authorization, CurrentUser } from 'src/common';
import { CreateStoreDto } from './dto/create-store.dto';
import { UpdateStoreDto } from './dto/update-store.dto';

@Controller('stores')
export class StoreController {
  constructor(private readonly storeService: StoreService) {}

  @Authorization()
  @Get('by-id/:id')
  async getById(@Param('id') storeId: string, @CurrentUser('id') userId: string) {
    return await this.storeService.getById(storeId, userId);
  }

  @HttpCode(200)
  @Authorization()
  @Post()
  async create(@CurrentUser('id') userId: string, @Body() dto: CreateStoreDto) {
    return await this.storeService.create(userId, dto);
  }

  @HttpCode(200)
  @Authorization()
  @Put(':id')
  async update(
    @CurrentUser('id') userId: string,
    @Body() dto: UpdateStoreDto,
    @Param('id') storeId: string,
  ) {
    return await this.storeService.update(storeId, userId, dto);
  }

  @HttpCode(200)
  @Authorization()
  @Delete(':id')
  async delete(@CurrentUser('id') userId: string, @Param('id') storeId: string) {
    return await this.storeService.delete(storeId, userId);
  }
}
