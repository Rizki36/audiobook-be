import type { Request, Response } from "express";
import bcrypt from "bcrypt";
import { PrismaClient } from "@prisma/client";
import { formatResponse } from "../../utils/formatter";
import jwt from "jsonwebtoken";
import { env } from "process";
import { signUpSchema } from "./auth.validation";
import { z } from "zod";
import { checkIsExistingEmail } from "./auth.helper";

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

type BodyRequest = z.infer<typeof signUpSchema>;
type SignUpRequest = Request<any, any, BodyRequest["body"]>;
export const signUpController = async (req: SignUpRequest, res: Response) => {
  const { body } = req;

  const isExistingEmail = await checkIsExistingEmail(body.email);

  if (isExistingEmail)
    return res.status(400).json(
      formatResponse({
        message: "Email is invalid or already taken",
      })
    );

  const hashedPassword = await bcrypt.hash(body.password, 10);

  const user = await prisma.user.create({
    data: {
      name: body.name,
      email: body.email,
      password: hashedPassword,
    },
  });

  // @ts-ignore
  delete user.password;

  res.json({
    user,
  });
};
