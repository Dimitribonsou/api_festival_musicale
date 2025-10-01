import { Router } from "express";
import { StatsController } from "./stats.controller";

const router = Router();

router.get("/", StatsController.getGlobales);
router.get("/concerts", StatsController.getParConcert);

export default router;
