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
    type: Number,
    min: 0
  },
  measureType: {
    type: String,
    enum: ['reps', 'time'],
    required: true,
    default: 'reps'
  },
  reps: {
    type: Number,
    min: 1
  },
  executionTime: {
    type: Number,
    min: 1
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

routineExerciseSchema.pre('validate', function () {
  if (this.measureType === 'reps' && !this.reps) {
    throw new Error('Falta el campo "reps" para un ejercicio medido por repeticiones');
  }
  if (this.measureType === 'time' && !this.executionTime) {
    throw new Error('Falta el campo "executionTime" para un ejercicio medido por tiempo');
  }
});

const routineSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  day: {
    type: String,
    trim: true
  },
  exercises: [routineExerciseSchema],
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }
}, { timestamps: true });


const RoutineModel = mongoose.model("Routine", routineSchema)

export default RoutineModel