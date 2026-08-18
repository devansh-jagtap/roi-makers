import { prisma } from "../src/lib/prisma";

async function main() {
  const profile = await prisma.profile.create({
    data: {
      authUserId: "57f9744b-b49e-4333-a856-2afda433f520",
      email: "devanshjagtap6@gmail.com",
      name: "Member 1",
      role: "MEMBER",
      active: true,
    },
  });

  console.log("Member profile created:");
  console.log(profile);
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });