import { HttpException, Injectable } from '@nestjs/common';
import * as fs from 'fs';
import * as path from 'path';
import { PrismaService } from '../prisma.service';

const MANUAL_PATH = path.join(__dirname, 'assets', 'product-manual.txt');

@Injectable()
export class ProductsService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll() {
    try {
      
      const products= await this.prisma.product.findMany();
      return products;
    } catch (error) {
        throw new HttpException("")
    }
  }

  async search(q: string) {
    
    return this.prisma.$queryRaw`SELECT * FROM "Product" WHERE name LIKE '%' || ${q} || '%'`

  }

  getManual(): string {

    return fs.readFileSync(MANUAL_PATH, 'utf-8');
  }
}
