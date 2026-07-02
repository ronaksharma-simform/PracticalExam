import { Module } from "@nestjs/common";
import { APP_INTERCEPTOR } from "@nestjs/core";
import { PrismaService } from "./prisma.service";
import { UsersModule } from "./users/users.module";
import { ProductsModule } from "./products/products.module";
import { InventoryModule } from "./inventory/inventory.module";
import { OrdersModule } from "./orders/orders.module";
import { ReportsModule } from "./reports/reports.module";
import { RequestLoggerInterceptor } from "./common/request-logger.interceptor";

@Module({
  imports: [
    UsersModule,
    ProductsModule,
    InventoryModule,
    OrdersModule,
    ReportsModule,
  ],
  providers: [
    PrismaService,
    { provide: APP_INTERCEPTOR, useClass: RequestLoggerInterceptor },
  ],
})
export class AppModule {}
