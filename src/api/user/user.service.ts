import { Injectable, NotFoundException } from '@nestjs/common';
import { hash } from 'argon2';
import { AuthDto } from './dto/auth.dto';
import { PrismaService } from 'src/infra/prisma/prisma.service';
import { ProductService } from '../product/product.service';

@Injectable()
export class UserService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly productService: ProductService,
  ) {}

  async getById(id: string) {
    const user = await this.prismaService.user.findUnique({
      where: { id },
      include: { stores: true, favorites: true, orders: true },
    });

    return user;
  }

  async getByEmail(email: string) {
    const user = await this.prismaService.user.findUnique({
      where: { email },
      include: { stores: true, favorites: true, orders: true },
    });

    return user;
  }

  async create(dto: AuthDto) {
    const { email, name, password } = dto;

    return this.prismaService.user.create({
      data: {
        name,
        email,
        password: await hash(password),
      },
    });
  }

  async toggleFavorite(productId: string, userId: string) {
    const user = await this.getById(userId);

    if (!user) {
      throw new NotFoundException('Пользователь не найден');
    }

    await this.productService.getById(productId);

    const isExist = user?.favorites.some((product) => product.id === productId);

    await this.prismaService.user.update({
      where: { id: user.id },
      data: { favorites: { [isExist ? 'disconnect' : 'connect']: { id: productId } } },
    });

    return true;
  }
}
