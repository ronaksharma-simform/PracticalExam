import { Injectable } from '@nestjs/common';
import * as fs from 'fs';
import * as path from 'path';
import { PrismaService } from '../prisma.service';

const MANUAL_PATH = path.join(__dirname, 'assets', 'product-manual.txt');

@Injectable()
export class ProductsService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll() {
    return this.prisma.product.findMany();
  }

  async search(q: string) {
    return this.prisma.$queryRawUnsafe(
      `SELECT * FROM "Product" WHERE name LIKE '%' || $1 || '%'`,
      q,
    );
  }

  getManual(): string {
    return fs.readFileSync(MANUAL_PATH, 'utf-8');
  }
}
