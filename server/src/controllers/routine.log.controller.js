import RoutineLogModel from "../models/routine.log.js";

class RoutineLogController {
  static createLog = async (req, res) => {
    try {
      const { routine, routineName, exercises } = req.body;
      const log = await RoutineLogModel.create({
        user: req.userId,
        routine,
        routineName,
        exercises
      });
      res.status(201).json(log);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  };

  static getLogs = async (req, res) => {
    try {
      const logs = await RoutineLogModel.find({ user: req.userId })
        .sort({ completedAt: -1 });
      res.json(logs);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  };

  static deleteAllLogs = async (req, res) => {
    try {
      await RoutineLogModel.deleteMany({ user: req.userId });
      res.json({ message: 'Historial eliminado' });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  };
}

export default RoutineLogController;