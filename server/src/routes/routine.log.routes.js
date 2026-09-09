import { Router } from "express";
import RoutineLogController from "../controllers/routine.log.controller.js";

const router = Router();

router.get("/", RoutineLogController.getLogs);

router.post("/", RoutineLogController.createLog);

export default router;