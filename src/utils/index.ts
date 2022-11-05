import { NextFunction, Request, Response } from "express";
import { AnyZodObject, ZodError } from "zod";
import { formatResponse } from "./formatter";

export const validation =
  (schema: AnyZodObject) =>
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      await schema.parseAsync({
        body: req.body,
        query: req.query,
        params: req.params,
      });
      return next();
    } catch (error) {
      if (typeof error === "string") {
        res.send(error);
      } else if (error instanceof ZodError) {
        const resErr = formatResponse({
          errors: error.issues,
        });
        res.json(resErr);
      } else {
        res.json(res);
      }
    }
  };
