
import { PrismaClient } from "@repo/order-db";

const prisma = new PrismaClient();

async function main() {
    const count = await prisma.order.count();
    console.log(`Total orders: ${count}`);

    // Check distribution of statuses
    const statuses = await prisma.order.groupBy({
        by: ['status'],
        _count: true
    });
    console.log("Order statuses:", statuses);
}

main()
    .catch((e) => console.error(e))
    .finally(async () => await prisma.$disconnect());
