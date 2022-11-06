import type { Request, Response } from "express";
import bcrypt from "bcrypt";
import { PrismaClient } from "@prisma/client";
import { formatResponse } from "../../utils/formatter";
import jwt from "jsonwebtoken";
import { env } from "process";

const prisma = new PrismaClient();

type SignRequest = Request<any, any, { email: string; password: string }>;
export const signController = async (req: SignRequest, res: Response) => {
  const { body } = req;

  const user = await prisma.user.findFirst({
    where: {
      email: body.email,
    },
  });

  if (!user) {
    return res
      .json(
        formatResponse({
          message: "Incorrect email or password.",
        })
      )
      .status(404);
  }

  const match = await bcrypt.compare(body.password, user?.password);

  if (!match) {
    return res.json(
      formatResponse({
        message: "Incorrect email or password.",
      })
    );
  }

  // @ts-ignore
  delete user.password;

  const token = jwt.sign({ id: user.id }, env.JWT_SECRET ?? "", {
    expiresIn: 86400, // 24 hours
  });

  res.cookie("token", token).json(
    formatResponse({
      data: user,
    })
  );
};
