import { Body, Controller, Get, Post } from '@nestjs/common';
import { OrdersService } from './orders.service';

@Controller('orders')
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @Post()
  create(@Body() body: { userId: number; items: { productId: number; quantity: number }[] }) {
    return this.ordersService.create(body.userId, body.items);
  }

  @Get()
  findAll() {
    return this.ordersService.findAll();
  }

  @Post('bulk-import')
  bulkImport(@Body() rows: { userId: number; totalAmount: number; status?: string }[]) {
    return this.ordersService.bulkImport(rows);
  }
}
