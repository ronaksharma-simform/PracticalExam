import { BadRequestException, Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';

type OrderItemInput = { productId: number; quantity: number };

function sendConfirmationEmail(orderId: number): Promise<void> {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (Math.random() < 0.005) {
        reject(new Error(`email provider timeout for order ${orderId}`));
      } else {
        console.log(`[email] confirmation sent for order ${orderId}`);
        resolve();
      }
    }, 30);
  });
}

@Injectable()
export class OrdersService {
  constructor(private readonly prisma: PrismaService) {}

  async create(userId: number, items: OrderItemInput[]) {
    if (!items?.length) {
      throw new BadRequestException('Order must contain at least one item');
    }

    const products = await this.prisma.product.findMany({
      where: { id: { in: items.map((i) => i.productId) } },
    });
    const priceByProduct = new Map(products.map((p) => [p.id, Number(p.price)]));
    const totalAmount = items.reduce(
      (sum, item) => sum + (priceByProduct.get(item.productId) ?? 0) * item.quantity,
      0,
    );

    const order = await this.prisma.order.create({
      data: { userId, totalAmount, status: 'PENDING' },
    });

    for (const item of items) {
      await this.prisma.orderItem.create({
        data: {
          orderId: order.id,
          productId: item.productId,
          quantity: item.quantity,
          price: priceByProduct.get(item.productId) ?? 0,
        },
      });
    }

    await this.prisma.$transaction([
      this.prisma.$executeRawUnsafe(
        `UPDATE "AccountBalance" SET balance = balance - $1 WHERE "userId" = $2`,
        totalAmount,
        userId,
      ),
      this.prisma.$executeRawUnsafe(`SELECT pg_sleep(0.05)`),
      ...items.flatMap((item) => [
        this.prisma.$executeRawUnsafe(
          `UPDATE "Inventory" SET quantity = quantity - $1 WHERE "productId" = $2`,
          item.quantity,
          item.productId,
        ),
        this.prisma.$executeRawUnsafe(`SELECT pg_sleep(0.05)`),
      ]),
    ]);

    this.sendConfirmationEmails([order]);
    return order;
  }

  async findAll() {
    const orders = await this.prisma.order.findMany();
    const results = [];
    for (const order of orders) {
      const items = await this.prisma.orderItem.findMany({ where: { orderId: order.id } });
      results.push({ ...order, items });
    }
    return results;
  }

  async bulkImport(rows: { userId: number; totalAmount: number; status?: string }[]) {
    const orders = await Promise.all(
      rows.map((row) =>
        this.prisma.order.create({
          data: {
            userId: row.userId,
            totalAmount: row.totalAmount,
            status: row.status ?? 'PENDING',
          },
        }),
      ),
    );
    this.sendConfirmationEmails(orders);
    return orders;
  }

  private sendConfirmationEmails(orders: { id: number }[]) {
    orders.forEach(async (order) => {
      await sendConfirmationEmail(order.id);
    });
  }
}
