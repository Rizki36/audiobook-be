import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();
export const checkIsExistingEmail = async (email: string) => {
  const user = await prisma.user.findFirst({
    where: {
      email,
    },
  });

  const isExistingEmail = !!user;

  return isExistingEmail;
};
