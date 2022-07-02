import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  // Connect the client
  await prisma.$connect();
  await prisma.user.create({
    data: {
      firstname: "Luca",
      lastname: "Coduri",
      username: "bafana",
      email: "luca@gmail.com",
      password: "banane",
    },
  });
}

main()
  .catch((e) => {
    throw e;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
