import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from 'src/infra/prisma/prisma.service';
import { ICapturePayment, YooCheckout } from '@a2seven/yoo-checkout';
import { OrderDto } from './dto/order.dto';
import { PaymentStatusDto } from './dto/payment-status.dto';
import { EnumOrderStatus } from '@prisma/client';

const checkout = new YooCheckout({
  shopId: process.env['YOOKASSA_SHOP_ID'] as string,
  secretKey: process.env['YOOKASSA_SECRET_KEY'] as string,
});

@Injectable()
export class OrderService {
  private readonly logger = new Logger(OrderService.name);

  constructor(private readonly prismaService: PrismaService) {}

  async createPayment(dto: OrderDto, userId: string) {
    const orderItems = dto.items.map((item) => ({
      quantity: item.quantity,
      price: item.price,
      product: { connect: { id: item.productId } },
      store: { connect: { id: item.storeId } },
    }));

    const total = dto.items.reduce((acc, item) => acc + item.price * item.quantity, 0);

    const order = await this.prismaService.order.create({
      data: {
        status: dto.status,
        items: { create: orderItems },
        total,
        user: { connect: { id: userId } },
      },
    });

    const payment = await checkout.createPayment({
      amount: { value: total.toFixed(2), currency: 'RUB' },
      capture: true,
      payment_method_data: { type: 'bank_card' },
      confirmation: {
        type: 'redirect',
        return_url: `${process.env.CLIENT_URL}/thanks`,
      },
      description: `Оплата заказа ${order.id}`,
      metadata: {
        orderId: order.id,
      },
    });

    return payment;
  }

  // Убрать logger после тестов
  async updateStatus(dto: PaymentStatusDto) {
    this.logger.log(`Webhook event: ${dto.event}`);

    switch (dto.event) {
      case 'payment.waiting_for_capture': {
        const capturePayment: ICapturePayment = {
          amount: {
            value: dto.object.amount.value,
            currency: dto.object.amount.currency,
          },
        };
        return checkout.capturePayment(dto.object.id, capturePayment);
      }

      case 'payment.succeeded': {
        const orderId = dto.object.metadata?.orderId;
        if (!orderId) {
          this.logger.error('orderId not found in metadata');
          return false;
        }

        await this.prismaService.order.update({
          where: { id: orderId },
          data: { status: EnumOrderStatus.PAYED },
        });

        this.logger.log(`Order ${orderId} marked as PAYED`);
        return true;
      }

      case 'payment.canceled': {
        const orderId = dto.object.metadata?.orderId;
        if (!orderId) return false;

        await this.prismaService.order.update({
          where: { id: orderId },
          data: { status: EnumOrderStatus.CANCELED },
        });

        this.logger.log(`Order ${orderId} marked as CANCELED`);
        return true;
      }

      case 'refund.succeeded': {
        const orderId = dto.object.metadata?.orderId;
        if (!orderId) return false;

        await this.prismaService.order.update({
          where: { id: orderId },
          data: { status: EnumOrderStatus.REFUNDED },
        });

        this.logger.log(`Order ${orderId} marked as REFUNDED`);
        return true;
      }

      default:
        this.logger.warn(`Unknown event`);
        return true;
    }
  }
}
