// router v1
import { Router } from "express";
import AuthRouter from "./auth/auth.router";

const router = Router();

// authentication router
router.use(AuthRouter);

export default router;
