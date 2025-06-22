import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  const adminEmail = process.env.ADMIN_EMAIL;
  const adminUsername = process.env.ADMIN_USERNAME || 'admin';
  const adminPasswordRaw = process.env.ADMIN_PASSWORD;

  if (!adminEmail || !adminPasswordRaw) {
    throw new Error('ADMIN_PASSWORD is not set');
  }

  const password = await bcrypt.hash(adminPasswordRaw, 10);

  await prisma.user.upsert({
    where: { email: adminEmail },
    update: {},
    create: {
      email: adminEmail,
      username: adminUsername,
      password,
      role: 'ADMIN',
    },
  });

  console.log(`✅ Admin ${adminEmail} created`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => {
    prisma.$disconnect();
  });
