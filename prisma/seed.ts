import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const USER_COUNT = 500;
const PRODUCT_COUNT = 2000;
const ORDER_COUNT = 20000;

function rand(n: number) {
  return Math.floor(Math.random() * n);
}

async function main() {
  console.log('Seeding users...');
  const userData = Array.from({ length: USER_COUNT }, (_, i) => ({
    email: `user${i}@example.com`,
    name: `User ${i}`,
  }));
  await prisma.user.createMany({ data: userData, skipDuplicates: true });
  const users = await prisma.user.findMany({ select: { id: true } });

  console.log('Seeding account balances...');
  await prisma.accountBalance.createMany({
    data: users.map((u) => ({ userId: u.id, balance: 1000 + rand(500) })),
    skipDuplicates: true,
  });

  console.log('Seeding products + inventory...');
  const productData = Array.from({ length: PRODUCT_COUNT }, (_, i) => ({
    sku: `SKU-${i}`,
    name: `Product ${i} ${['Widget', 'Gadget', 'Gizmo', 'Doohickey'][i % 4]}`,
    description: `Description for product ${i}`,
    price: Math.round((5 + rand(200) + rand(100) / 100) * 100) / 100,
  }));
  await prisma.product.createMany({ data: productData, skipDuplicates: true });
  const products = await prisma.product.findMany({ select: { id: true } });
  await prisma.inventory.createMany({
    data: products.map((p) => ({ productId: p.id, quantity: 10 + rand(100) })),
    skipDuplicates: true,
  });

  console.log('Seeding orders + order items (batched)...');
  const BATCH = 500;
  for (let i = 0; i < ORDER_COUNT; i += BATCH) {
    const batchOrders = Array.from({ length: Math.min(BATCH, ORDER_COUNT - i) }, () => ({
      userId: users[rand(users.length)].id,
      totalAmount: 10 + rand(300),
      status: ['PENDING', 'PAID', 'SHIPPED'][rand(3)],
    }));
    await prisma.order.createMany({ data: batchOrders });
    console.log(`  ...${Math.min(i + BATCH, ORDER_COUNT)}/${ORDER_COUNT} orders`);
  }

  console.log('Seeding order items...');
  const orders = await prisma.order.findMany({ select: { id: true } });
  for (let i = 0; i < orders.length; i += BATCH) {
    const chunk = orders.slice(i, i + BATCH);
    const items = chunk.flatMap((o) => {
      const itemCount = 1 + rand(3);
      return Array.from({ length: itemCount }, () => {
        const p = products[rand(products.length)];
        return {
          orderId: o.id,
          productId: p.id,
          quantity: 1 + rand(4),
          price: Math.round((5 + rand(200) + rand(100) / 100) * 100) / 100,
        };
      });
    });
    await prisma.orderItem.createMany({ data: items });
  }

  console.log('Seed complete.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
