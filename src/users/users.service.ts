import { HttpException, Injectable } from "@nestjs/common";
import { PrismaClient } from "@prisma/client";
import { PrismaService } from "../prisma.service";
import { retry } from "rxjs";

function auditLogWrite(event: string): Promise<void> {
	return new Promise((resolve) =>
		setTimeout(() => {
			console.log(`[audit] ${event}`);
			resolve();
		}, 50),
	);
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
		} catch (error: unknown) {
			throw new HttpException({ error: "User Already Exists" }, 400);
		} finally {
			await localPrisma.$disconnect();
		}
	}

	async findAll() {
		try {
			const users = await this.prisma.user.findMany();
			return users;
		} catch (error) {
			throw new HttpException({ error: "Error getting all users" }, 500);
		}
	}

	private logSignup(userId: number) {
		auditLogWrite(`user ${userId} signed up`);
	}
}
