import { Body, Controller, Get, Param, ParseIntPipe, Post } from '@nestjs/common';
import { InventoryService } from './inventory.service';

@Controller('inventory')
export class InventoryController {
  constructor(private readonly inventoryService: InventoryService) {}

  @Get(':productId')
  getQuantity(@Param('productId', ParseIntPipe) productId: number) {
    return this.inventoryService.getQuantity(productId);
  }

  @Post(':productId/reserve')
  reserve(
    @Param('productId', ParseIntPipe) productId: number,
    @Body('quantity') quantity: number,
  ) {
    return this.inventoryService.reserve(productId, quantity);
  }

  @Post(':productId/restock')
  restock(
    @Param('productId', ParseIntPipe) productId: number,
    @Body() body: { quantity: number; userId: number; refundAmount: number },
  ) {
    return this.inventoryService.restock(
      productId,
      body.quantity,
      body.userId,
      body.refundAmount,
    );
  }
}
