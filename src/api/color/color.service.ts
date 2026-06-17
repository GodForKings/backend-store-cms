import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/infra/prisma/prisma.service';
import { ColorDto } from './dto/color.dto';

@Injectable()
export class ColorService {
  constructor(private readonly prismaService: PrismaService) {}

  async getById(id: string) {
    const color = await this.prismaService.color.findUnique({
      where: { id },
    });

    if (!color) {
      throw new NotFoundException('Цвет не найден');
    }

    return color;
  }

  async getByStoreId(storeId: string) {
    const store = await this.prismaService.store.findUnique({
      where: { id: storeId },
      include: { colors: true },
    });

    if (!store) {
      throw new NotFoundException('Магазин не найден');
    }

    return store.colors;
  }

  async create(storeId: string, dto: ColorDto) {
    const { name, value } = dto;

    return await this.prismaService.color.create({
      data: {
        name,
        value,
        storeId,
      },
    });
  }

  async update(colorId: string, dto: ColorDto) {
    const { name, value } = dto;

    await this.getById(colorId);

    return this.prismaService.color.update({ where: { id: colorId }, data: { name, value } });
  }

  async delete(id: string) {
    await this.getById(id);

    return await this.prismaService.color.delete({ where: { id } });
  }
}
