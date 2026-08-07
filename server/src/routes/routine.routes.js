import { Router } from "express";

import RoutineController from "../controllers/routine.controller.js";

const router = Router()

router.get("/", RoutineController.getRoutines)

router.get("/:id", RoutineController.getRoutineById)

router.post("/", RoutineController.createRoutine)

router.patch("/:id", RoutineController.updateRoutine)

router.delete("/:id", RoutineController.deleteRoutine)

export default router