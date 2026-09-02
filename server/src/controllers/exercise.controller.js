import ExerciseModel from "../models/exercise.js"

class ExerciseController {

    static getExercises = async (req, res) => {
        try {
            const exercises = await ExerciseModel.find({ user: req.userId }).sort({ name: 1 })
            res.json(exercises);
        } catch (error) {
            res.status(500).json({ message: error.message });
            }
    };

    static getExerciseById = async (req, res) => {
        try {
            const exercise = await ExerciseModel.findOne({ _id: req.params.id, user: req.userId });
            if (!exercise) {
                return res.status(404).json({ message: 'Ejercicio no encontrado' });
            }
            res.json(exercise);
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    };

    static createExercise = async (req, res) => {
        try {
            const exercise = new ExerciseModel({ ...req.body, user: req.userId })
            const saved = await exercise.save();
            res.status(201).json(saved);
        } catch (error) {
            res.status(400).json({ message: error.message });
        }
    };

    static updateExercise = async (req, res) => {
        try {
            const updated = await ExerciseModel.findOneAndUpdate(
        { _id: req.params.id, user: req.userId },
        req.body,
        { new: true, runValidators: true 
    });
        if (!updated) {
            return res.status(404).json({ message: 'Ejercicio no encontrado' });
            }
            res.json(updated);
        } catch (error) {
            res.status(400).json({ message: error.message });
        }
    };

    static deleteExercise = async (req, res) => {
        try {
            const deleted = await ExerciseModel.findOneAndDelete({ _id: req.params.id, user: req.userId });;
            if (!deleted) {
            return res.status(404).json({ message: 'Ejercicio no encontrado' });
            }
            res.json({ message: 'Ejercicio eliminado' });
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    };
}


export default ExerciseController