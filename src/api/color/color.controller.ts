import { Body, Controller, Delete, Get, HttpCode, Param, Post, Put } from '@nestjs/common';
import { ColorService } from './color.service';
import { Authorization } from 'src/common';
import { ColorDto } from './dto/color.dto';

@Controller('colors')
export class ColorController {
  constructor(private readonly colorService: ColorService) {}

  @Authorization()
  @Get('by-storeId/:id')
  async getByStoreId(@Param('id') storeId: string) {
    return await this.colorService.getByStoreId(storeId);
  }

  @Authorization()
  @Get('by-id/:id')
  async getById(@Param('id') id: string) {
    return await this.colorService.getById(id);
  }

  @HttpCode(200)
  @Authorization()
  @Post(':storeId')
  async create(@Param('storeId') storeId: string, @Body() dto: ColorDto) {
    return await this.colorService.create(storeId, dto);
  }

  @HttpCode(200)
  @Authorization()
  @Put(':id')
  async update(@Param('id') colorId: string, @Body() dto: ColorDto) {
    return await this.colorService.update(colorId, dto);
  }

  @HttpCode(200)
  @Authorization()
  @Delete(':id')
  async delete(@Param('id') id: string) {
    return await this.colorService.delete(id);
  }
}
