import { Router } from "express";
import { validation } from "../../utils";
import { signController, signUpController } from "./auth.controller";
import { signSchema, signUpSchema } from "./auth.validation";

const router = Router();

router.post("/sign-in", validation(signSchema), signController);

router.post("/sign-up", validation(signUpSchema), signUpController);

export default router;
