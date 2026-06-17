import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/infra/prisma/prisma.service';
import { CreateStoreDto } from './dto/create-store.dto';
import { UpdateStoreDto } from './dto/update-store.dto';

@Injectable()
export class StoreService {
  constructor(private readonly prismaService: PrismaService) {}

  async getById(storeId: string, userId: string) {
    const store = await this.prismaService.store.findUnique({ where: { id: storeId, userId } });

    if (!store) {
      throw new NotFoundException('Магазин не найден или вы не являетесь его владельцем');
    }

    return store;
  }

  async create(userId: string, dto: CreateStoreDto) {
    const { title } = dto;

    return await this.prismaService.store.create({ data: { title, userId } });
  }

  async update(storeId: string, userId: string, dto: UpdateStoreDto) {
    const { title, description } = dto;

    await this.getById(storeId, userId);

    return this.prismaService.store.update({
      where: { id: storeId },
      data: {
        title,
        description,
        userId,
      },
    });
  }

  async delete(storeId: string, userId: string) {
    await this.getById(storeId, userId);

    return this.prismaService.store.delete({ where: { id: storeId } });
  }
}
