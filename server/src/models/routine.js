import mongoose from "mongoose";

const routineExerciseSchema = new mongoose.Schema({
  exercise: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Exercise',
    required: true
  },
  series: {
    type: Number,
    required: true,
    default: 3
  },
  weight: {
    // peso en kg, opcional (hay ejercicios sin carga externa)
    type: Number,
    min: 0
  },
  executionTime: {
    type: Number,
    required: true
  },
  restBetweenSeries: {
    type: Number,
    required: true
  },
  restAfterExercise: {
    type: Number,
    default: 0
  }
}, { _id: false });

const routineSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  day: {
    // ej: "Lunes", "Full body", lo que quieras usar como etiqueta
    type: String,
    trim: true
  },
  exercises: [routineExerciseSchema]
}, { timestamps: true });



const routineModel = mongoose.model("Routine", routineSchema)