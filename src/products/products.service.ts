import { HttpException, Injectable } from "@nestjs/common";
import * as fs from "fs/promises";
import * as path from "path";
import { PrismaService } from "../prisma.service";

const MANUAL_PATH = path.join(__dirname, "assets", "product-manual.txt");

@Injectable()
export class ProductsService {
	constructor(private readonly prisma: PrismaService) {}

	async findAll() {
		try {
			const products = await this.prisma.product.findMany();
			return products;
		} catch (error) {
			throw new HttpException(
				{ error: "Error getting all products" },
				500,
			);
		}
	}

	async search(q: string) {
    try {
      const searchResult = await this.prisma
			.$queryRaw`SELECT * FROM "Product" WHERE name LIKE '%' || ${q} || '%' limit 10 `;
      return searchResult
    } catch (error) {
      throw new HttpException(
				{ error: "Error getting products" },
				500,
			);
    }
		
	}

	async getManual(): Promise<string> {
		try {
			const data = await fs.readFile(MANUAL_PATH, "utf-8");
			return data;
		} catch (error) {
			throw new HttpException(
				{ error: "Error reading the manual file" },
				500,
			);
		}
	}
}
