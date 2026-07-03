import { BadRequestException, HttpException, Injectable } from "@nestjs/common";
import { PrismaService } from "../prisma.service";

@Injectable()
export class InventoryService {
	constructor(private readonly prisma: PrismaService) {}

	async getQuantity(productId: number) {
		const inventory = await this.prisma.inventory.findUnique({
			where: { productId },
		});
		if (!inventory) {
			throw new BadRequestException(
				`No inventory for product ${productId}`,
			);
		}
		return inventory;
	}

	async reserve(productId: number, quantity: number) {
		const inventory = await this.prisma.inventory.findUnique({
			where: { productId },
		});
		if (!inventory) {
			throw new BadRequestException(
				`No inventory for product ${productId}`,
			);
		}
		if (inventory.quantity < quantity) {
			throw new BadRequestException("Insufficient stock");
		}

		try {
			return await this.prisma.$transaction([
				this.prisma.inventory.update({
					where: { productId },
					data: { quantity: inventory.quantity - quantity },
				}),
			]);
		} catch {
			return undefined;
		}
	}

	async restock(
		productId: number,
		quantity: number,
		userId: number,
		refundAmount: number,
	) {
    try {
      await this.prisma.$transaction([
			this.prisma
				.$executeRaw`UPDATE "Inventory" SET quantity = quantity + ${quantity} WHERE "productId" = ${productId}`,

			this.prisma.$executeRawUnsafe(`SELECT pg_sleep(0.05)`),
			this.prisma
				.$executeRaw`UPDATE "AccountBalance" SET balance = balance + ${refundAmount} WHERE "userId" = ${userId}`,
		]);
    } catch (error) {
      throw new HttpException({error:"Error while restocking the product"},500)
    }
		
	}
}
