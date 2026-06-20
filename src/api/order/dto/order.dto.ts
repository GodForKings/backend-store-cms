import { EnumOrderStatus } from '@prisma/client';
import { Type } from 'class-transformer';
import {
  ArrayMinSize,
  IsArray,
  IsEnum,
  IsNumber,
  IsOptional,
  IsUUID,
  Max,
  Min,
  ValidateNested,
} from 'class-validator';

export class OrderItemDto {
  @IsNumber({}, { message: 'Количество должно быть числом' })
  @Min(1, { message: 'Количество должно быть не меньше 1' })
  @Max(999, { message: 'Количество должно быть не больше 999' })
  quantity!: number;

  @IsNumber({}, { message: 'Цена должна быть числом' })
  @Min(0, { message: 'Цена не может быть отрицательной' })
  price!: number;

  @IsUUID('4', { message: 'productId должен быть валидным UUID' })
  productId!: string;

  @IsUUID('4', { message: 'storeId должен быть валидным UUID' })
  storeId!: string;
}

export class OrderDto {
  @IsOptional()
  @IsEnum(EnumOrderStatus, {
    message: 'Статус заказа должен соответствовать:' + Object.values(EnumOrderStatus).join(', '),
  })
  status?: EnumOrderStatus = EnumOrderStatus.PENDING;

  @IsArray({ message: 'items должен быть массивом' })
  @ArrayMinSize(1, { message: 'Заказ должен содержать хотя бы один товар' })
  @ValidateNested({ each: true })
  @Type(() => OrderItemDto)
  items!: OrderItemDto[];
}
