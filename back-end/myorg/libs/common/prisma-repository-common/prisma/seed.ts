import { PrismaClient } from '@prisma/client';
// eslint-disable-next-line @nx/enforce-module-boundaries
import { seed } from '../src/';

const prisma = new PrismaClient();

async function main() {
  seed(prisma);
}
main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
