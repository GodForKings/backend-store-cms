import { Body, Controller, HttpCode, Post } from '@nestjs/common';
import { OrderService } from './order.service';
import { Authorization, CurrentUser } from 'src/common';
import { OrderDto } from './dto/order.dto';
import { PaymentStatusDto } from './dto/payment-status.dto';

@Controller('orders')
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  @Authorization()
  @Post('place')
  async checkout(@Body() dto: OrderDto, @CurrentUser('id') userId: string) {
    return await this.orderService.createPayment(dto, userId);
  }

  @HttpCode(200)
  @Post('status')
  async updateStatus(@Body() dto: PaymentStatusDto) {
    return await this.orderService.updateStatus(dto);
  }
}
