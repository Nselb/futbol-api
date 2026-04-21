import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  const username = process.env.ADMIN_USERNAME;
  const password = process.env.ADMIN_PASSWORD;
  const name = process.env.ADMIN_NAME;

  if (!username || !password || !name) {
    console.error(`Missing admin data on config`);
    return;
  }

  const exists = await prisma.user.findUnique({ where: { username } });

  if (exists) {
    console.log(`User ${username} already exists, skipping seed`);
    return;
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  await prisma.user.create({
    data: {
      username,
      password: hashedPassword,
      name,
      role: 'ADMIN',
    },
  });

  console.log('Superadmin created successfully');
}

main()
  .catch((e) => {
    console.error(e);
  })
  .finally(() => prisma.$disconnect());
