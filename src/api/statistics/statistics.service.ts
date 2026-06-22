import { Injectable } from '@nestjs/common';
import dayjs from 'dayjs';
import { PrismaService } from 'src/infra/prisma/prisma.service';
import { GetLastUsers, GetMainStatistics } from './interfaces/types';
import { formatDate } from 'src/common';

dayjs.locale('ru');

@Injectable()
export class StatisticsService {
  constructor(private readonly prismaService: PrismaService) {}

  private async calculateTotalRevenue(storeId: string) {
    const orders = await this.prismaService.order.findMany({
      where: {
        items: { some: { store: { id: storeId } } },
      },
      include: { items: { where: { storeId } } },
    });

    const totalRevenue = orders.reduce((acc, order) => {
      const total = order.items.reduce((itemAcc, item) => {
        return itemAcc + Number(item.price) * item.quantity;
      }, 0);

      return acc + total;
    }, 0);

    return totalRevenue;
  }

  private async countProducts(storeId: string) {
    return await this.prismaService.product.count({ where: { storeId } });
  }

  private async countCategories(storeId: string) {
    return await this.prismaService.category.count({ where: { storeId } });
  }

  private async calculateAverageRating(storeId: string) {
    const averageRating = await this.prismaService.review.aggregate({
      where: { storeId },
      _avg: { rating: true },
    });

    return averageRating._avg.rating ?? 0;
  }

  private async calculateMonthlySales(storeId: string) {
    const startDate = dayjs().subtract(30, 'days').startOf('day').toDate();
    const endDate = dayjs().endOf('day').toDate();

    const salesRaw = await this.prismaService.order.findMany({
      where: { createdAt: { gte: startDate, lte: endDate }, items: { some: { storeId } } },
      include: { items: true },
    });

    const salesByDate = new Map<string, number>();

    salesRaw.forEach((order) => {
      const formattedDate = formatDate(new Date(order.createdAt));

      const total = order.items.reduce((total, item) => {
        return total + Number(item.price) * item.quantity;
      }, 0);

      if (salesByDate.has(formattedDate)) {
        salesByDate.set(formattedDate, Number(salesByDate.get(formattedDate)) + total);
      } else {
        salesByDate.set(formattedDate, total);
      }
    });

    const monthlySales = Array.from(salesByDate, ([date, value]) => ({ date, value }));

    return monthlySales;
  }

  private async getUsers(storeId: string): Promise<GetLastUsers[]> {
    const lastUsers = await this.prismaService.user.findMany({
      where: { orders: { some: { items: { some: { storeId } } } } },
      orderBy: { createdAt: 'desc' },
      include: {
        orders: {
          where: { items: { some: { storeId } } },
          include: { items: { where: { storeId }, select: { price: true } } },
        },
      },
    });

    return lastUsers.map((user) => {
      const lastOrder = user.orders[user.orders.length - 1];

      const total = lastOrder.items.reduce((total, item) => total + Number(item.price), 0);

      return { id: user.id, name: user.name, email: user.email, picture: user.picture, total };
    });
  }

  async getMainStatistics(storeId: string): Promise<GetMainStatistics[]> {
    const totalRevenue = await this.calculateTotalRevenue(storeId);

    const productCount = await this.countProducts(storeId);
    const categoriesCount = await this.countCategories(storeId);

    const avgRating = await this.calculateAverageRating(storeId);

    return [
      { id: 1, name: 'Выручка', value: totalRevenue },
      { id: 2, name: 'Товары', value: productCount },
      { id: 3, name: 'Категории', value: categoriesCount },
      { id: 4, name: 'Средний рейтинг', value: avgRating },
    ];
  }

  async getMiddleStatistic(storeId: string) {
    const monthlySales = await this.calculateMonthlySales(storeId);

    const users = await this.getUsers(storeId);

    return { monthlySales, users };
  }
}
