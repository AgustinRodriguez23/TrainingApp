import mongoose from "mongoose";

const setLogSchema = new mongoose.Schema({
  seriesNumber: { type: Number, required: true },
  reps: { type: Number },
  weight: { type: Number }
}, { _id: false });

const exerciseLogSchema = new mongoose.Schema({
  exercise: { type: mongoose.Schema.Types.ObjectId, ref: 'Exercise' },
  exerciseName: { type: String, required: true }, // guardado por si el ejercicio se borra después
  sets: [setLogSchema]
}, { _id: false });

const routineLogSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  routine: { type: mongoose.Schema.Types.ObjectId, ref: 'Routine' },
  routineName: { type: String, required: true }, // idem, por si se borra la rutina
  completedAt: { type: Date, default: Date.now },
  exercises: [exerciseLogSchema]
});

const RoutineLogModel = mongoose.model("RoutineLog", routineLogSchema);

export default RoutineLogModel;