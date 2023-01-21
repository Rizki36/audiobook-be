// router v1
import { Router } from "express";
import AuthRouter from "./auth/auth.router";

const router = Router();

// authentication router
router.use("/auth", AuthRouter);

router.get("/", (req, res) => {
  res.send("Welcome to AudioBook");
});

export default router;
