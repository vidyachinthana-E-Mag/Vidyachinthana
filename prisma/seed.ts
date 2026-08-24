import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  console.log("Seeding the database...");

  const adminEmail = "Admin.Vidyachinthana.lk";
  const hashedPassword = await bcrypt.hash("admin@1234", 10);

  const admin = await prisma.user.upsert({
    where: { email: adminEmail },
    update: {
      password: hashedPassword,
      role: "OWNER",
    },
    create: {
      email: adminEmail,
      name: "Super Admin",
      password: hashedPassword,
      role: "OWNER",
      image:
        "https://images.unsplash.com/photo-1633332755192-727a05c4013d?q=80&w=200",
    },
  });

  console.log("Admin user seeded:", admin.email);

  // Create default Site Configuration
  await prisma.siteConfig.upsert({
    where: { id: "default" },
    update: {},
    create: {
      id: "default",
      siteName: "Vidya Chinthana (විද්‍යා චින්තන)",
      tagline: "Digital Science, Technology & Speculative Philosophy Magazine",
      footerText:
        "Vidya Chinthana — Exploring frontiers of science, synthetic consciousness, and Sri Lankan research archives.",
    },
  });

  console.log("Seeding completed successfully!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
