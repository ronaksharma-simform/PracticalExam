import { Controller, Get, Query } from '@nestjs/common';
import { ProductsService } from './products.service';

@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Get('search')
  search(@Query('q') q: string) {
    return this.productsService.search(q ?? '');
  }

  @Get('manual')
  getManual() {
    return this.productsService.getManual();
  }

  @Get()
  findAll() {
    return this.productsService.findAll();
  }
}
