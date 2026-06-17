import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/infra/prisma/prisma.service';
import { CategoryDto } from './dto/category.dto';

@Injectable()
export class CategoryService {
  constructor(private readonly prismaService: PrismaService) {}

  async getById(id: string) {
    const category = await this.prismaService.category.findUnique({
      where: { id },
    });

    if (!category) {
      throw new NotFoundException('Категория не найдена');
    }

    return category;
  }

  async getByStoreId(storeId: string) {
    const store = await this.prismaService.store.findUnique({
      where: { id: storeId },
      include: { categories: true },
    });

    if (!store) {
      throw new NotFoundException('Магазин не найден');
    }

    return store.categories;
  }

  async create(storeId: string, dto: CategoryDto) {
    const { title, description } = dto;

    return await this.prismaService.category.create({ data: { title, description, storeId } });
  }

  async update(categoryId: string, dto: CategoryDto) {
    const { title, description } = dto;

    await this.getById(categoryId);

    return this.prismaService.category.update({
      where: { id: categoryId },
      data: { title, description },
    });
  }

  async delete(id: string) {
    await this.getById(id);

    return this.prismaService.category.delete({ where: { id } });
  }
}
