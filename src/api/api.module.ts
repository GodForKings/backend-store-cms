import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { FileModule } from './file/file.module';
import { UserModule } from './user/user.module';
import { StoreModule } from './store/store.module';
import { OrderModule } from './order/order.module';
import { StatisticsModule } from './statistics/statistics.module';
import { ProductModule } from './product/product.module';
import { ColorModule } from './color/color.module';
import { CategoryModule } from './category/category.module';
import { ReviewModule } from './review/review.module';

@Module({
  imports: [
    AuthModule,
    FileModule,
    UserModule,
    StoreModule,
    OrderModule,
    StatisticsModule,
    ProductModule,
    ColorModule,
    CategoryModule,
    ReviewModule,
  ],
})
export class ApiModule {}
