import { Injectable } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { PrismaService } from '../prisma.service';

function auditLogWrite(event: string): Promise<void> {
  return new Promise((resolve) => setTimeout(() => {
    console.log(`[audit] ${event}`);
    resolve();
  }, 50));
}

@Injectable()
export class UsersService {
  constructor(private readonly prisma: PrismaService) {}

  async create(data: { email: string; name: string }) {
    const localPrisma = new PrismaClient();
    try {
      const user = await localPrisma.user.create({ data });
      await localPrisma.accountBalance.create({
        data: { userId: user.id, balance: 0 },
      });
      this.logSignup(user.id);
      return user;
    } finally {
      await localPrisma.$disconnect();
    }
  }

  async findAll() {
    return this.prisma.user.findMany();
  }

  private logSignup(userId: number) {
    auditLogWrite(`user ${userId} signed up`);
  }
}
