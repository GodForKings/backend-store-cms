import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/infra/prisma/prisma.service';
import { ReviewDto } from './dto/review.dto';
import { ProductService } from '../product/product.service';

@Injectable()
export class ReviewService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly productService: ProductService,
  ) {}

  async getByStoreId(storeId: string) {
    return await this.prismaService.review.findMany({
      where: { storeId },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            picture: true,
          },
        },
      },
    });
  }

  async getById(id: string, userId: string) {
    const review = await this.prismaService.review.findUnique({
      where: { id, userId },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            picture: true,
          },
        },
      },
    });

    if (!review) {
      throw new NotFoundException('Отзыв не найден или вы не являетесь его владельцем');
    }

    return review;
  }

  async create(userId: string, productId: string, storeId: string, dto: ReviewDto) {
    await this.productService.getById(productId);

    return await this.prismaService.review.create({
      data: {
        ...dto,
        product: { connect: { id: productId } },
        user: { connect: { id: userId } },
        store: { connect: { id: storeId } },
      },
    });
  }

  async delete(id: string, userId: string) {
    await this.getById(id, userId);

    return await this.prismaService.review.delete({ where: { id } });
  }
}
