import RoutineModel from "../models/routine.js"

class RoutineController {

    static getRoutines = async (req, res) => {
        try {
            const routines = await RoutineModel.find({ user: req.userId })
                .populate('exercises.exercise')
                .sort({ createdAt: -1 });;
            res.json(routines);
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    };

    static getRoutineById = async (req, res) => {
        try {
            const routine = await RoutineModel.findOne({ _id: req.params.id, user: req.userId }).populate('exercises.exercise');
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
            const routine = new RoutineModel({ ...req.body, user: req.userId })
            await routine.save();
            const populated = await routine.populate('exercises.exercise');
            res.status(201).json(populated);
        } catch (error) {
            res.status(400).json({ message: error.message });
        }
    };

    static updateRoutine = async (req, res) => {
        try {
            const updated = await RoutineModel.findOneAndUpdate(
                { _id: req.params.id, user: req.userId },
            req.body,
                { new: true, runValidators: true }
            ).populate('exercises.exercise');
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
            const deleted = await RoutineModel.findOneAndDelete({ _id: req.params.id, user: req.userId });
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
