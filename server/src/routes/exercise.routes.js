import { Router } from "express";

import ExerciseController from "../controllers/exercise.controller.js";

const router = Router()

router.get("/", ExerciseController.getExercises)

router.get("/:id", ExerciseController.getExerciseById)

router.post("/", ExerciseController.createExercise)

router.patch("/:id", ExerciseController.updateExercise)

router.delete("/:id", ExerciseController.deleteExercise)

export default router