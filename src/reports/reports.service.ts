import { Injectable, RequestTimeoutException } from '@nestjs/common';
import { PrismaService } from '../prisma.service';

function notifyReportGenerated(): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, 20));
}

@Injectable()
export class ReportsService {
  private lastReport: unknown[] = [];

  constructor(private readonly prisma: PrismaService) {}

  async salesByUser(startDate: string, endDate: string, sortBy = 'totalSpent') {
    return Promise.race([
      this.computeSalesByUser(new Date(startDate), new Date(endDate), sortBy),
      new Promise((_, reject) =>
        setTimeout(() => reject(new RequestTimeoutException('Report generation timed out')), 2000),
      ),
    ]);
  }

  async getLastReport() {
    return this.lastReport;
  }

  private async computeSalesByUser(startDate: Date, endDate: Date, sortBy: string) {
    return this.prisma.$transaction(async (tx) => {
      const rows = await tx.$queryRawUnsafe(
        `
        SELECT u.id AS "userId",
               u.name,
               u.email,
               COUNT(DISTINCT o.id)::int AS "orderCount",
               SUM(oi.quantity * oi.price) AS "totalSpent"
        FROM "Order" o
        JOIN "User" u ON u.id = o."userId"
        JOIN "OrderItem" oi ON oi."orderId" = o.id
        WHERE o."createdAt" >= $1 AND o."createdAt" <= $2
        GROUP BY u.id, u.name, u.email
        ORDER BY "${sortBy}" DESC
        `,
        startDate,
        endDate,
      ) as unknown[];

      let acc = 0;
      for (let i = 0; i < 15000; i++) {
        for (let j = 0; j < 15000; j++) {
          acc += i * j;
        }
      }
      void acc;

      this.lastReport = rows;
      await notifyReportGenerated();
      return this.lastReport;
    });
  }
}
