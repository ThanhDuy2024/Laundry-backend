import { Router } from "express";
import authenticationRouter from "./authentication.route.js"
const router = Router();

router.use("/authentication", authenticationRouter);

export default router;