import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/infra/prisma/prisma.service';
import { ProductDto } from './dto/product.dto';

@Injectable()
export class ProductService {
  constructor(private readonly prismaService: PrismaService) {}

  private async getSearchTermFilter(searchTerm: string) {
    return await this.prismaService.product.findMany({
      where: {
        OR: [
          {
            title: {
              contains: searchTerm,
              mode: 'insensitive',
            },
          },
          {
            description: {
              contains: searchTerm,
              mode: 'insensitive',
            },
          },
        ],
      },
    });
  }

  async getAll(searchTerm?: string) {
    if (searchTerm) {
      return await this.getSearchTermFilter(searchTerm);
    }

    return await this.prismaService.product.findMany({
      orderBy: {
        createdAt: 'desc',
      },
      include: {
        category: true,
        color: true,
        reviews: true,
      },
    });
  }

  async getByStoreId(storeId: string) {
    return this.prismaService.product.findMany({
      where: { storeId },
      include: {
        category: true,
        color: true,
      },
    });
  }

  async getById(id: string) {
    const product = await this.prismaService.product.findUnique({
      where: {
        id,
      },
      include: {
        category: true,
        color: true,
        reviews: true,
      },
    });

    if (!product) {
      throw new NotFoundException('Товар не найден');
    }

    return product;
  }

  async getByCategory(categoryId: string) {
    const products = await this.prismaService.product.findMany({
      where: {
        category: { id: categoryId },
      },
      include: { category: true },
    });

    if (!products.length) {
      throw new NotFoundException('Товары не найдены');
    }

    return products;
  }

  async getMostPopular() {
    const mostPopularProducts = await this.prismaService.orderItem.groupBy({
      by: ['productId'],
      _count: { id: true },
      orderBy: {
        _count: {
          id: 'desc',
        },
      },
    });

    const productIds = mostPopularProducts
      .map((item) => item.productId)
      .filter((id) => id !== null);

    const products = await this.prismaService.product.findMany({
      where: { id: { in: productIds } },
      include: { category: true },
    });

    return products;
  }

  async getSimilar(id: string) {
    const currentProduct = await this.getById(id);

    const products = await this.prismaService.product.findMany({
      where: {
        category: { title: currentProduct.category?.title },
        NOT: { id: currentProduct.id },
      },
      orderBy: { createdAt: 'desc' },
      include: { category: true },
    });

    return products;
  }

  async create(storeId: string, dto: ProductDto, userId: string) {
    const { title, description, price, images, categoryId, colorId } = dto;

    return this.prismaService.product.create({
      data: { title, description, price, images, categoryId, colorId, storeId, userId },
    });
  }

  async update(productId: string, dto: ProductDto) {
    await this.getById(productId);

    return await this.prismaService.product.update({ where: { id: productId }, data: dto });
  }

  async delete(productId: string) {
    await this.getById(productId);

    return await this.prismaService.product.delete({ where: { id: productId } });
  }
}
