import { Router } from "express";
import { validation } from "../../utils";
import { signController } from "./auth.controller";
import { signSchema } from "./auth.validation";

const router = Router();

router.post("/sign-in", validation(signSchema), signController);

export default router;
