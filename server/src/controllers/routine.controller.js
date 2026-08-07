import RoutineModel from "../models/routine.js"

class RoutineController {

    static getRoutines = async (req, res) => {
        try {
            const routines = await RoutineModel.find()
            .populate('exercises.exercise')
            .sort({ createdAt: -1 });
            res.json(routines);
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    };

    static getRoutineById = async (req, res) => {
        try {
            const routine = await RoutineModel.findById(req.params.id).populate('exercises.exercise');
            if (!routine) {
            return res.status(404).json({ message: 'Rutina no encontrada' });
            }
            res.json(routine);
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    };

    static createRoutine = async (req, res) => {
        try {
            const routine = new RoutineModel(req.body);
            const saved = await routine.save();
            res.status(201).json(saved);
        } catch (error) {
            res.status(400).json({ message: error.message });
        }
    };

    static updateRoutine = async (req, res) => {
        try {
            const updated = await RoutineModel.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true
            }).populate('exercises.exercise');
            if (!updated) {
            return res.status(404).json({ message: 'Rutina no encontrada' });
            }
            res.json(updated);
        } catch (error) {
            res.status(400).json({ message: error.message });
        }
    };

    static deleteRoutine = async (req, res) => {
        try {
            const deleted = await RoutineModel.findByIdAndDelete(req.params.id);
            if (!deleted) {
            return res.status(404).json({ message: 'Rutina no encontrada' });
            }
            res.json({ message: 'Rutina eliminada' });
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    }
}

export default RoutineController
