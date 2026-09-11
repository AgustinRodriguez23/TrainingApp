import api from './api';

export const getRoutineLogs = () => api.get('/routine-logs');
export const createRoutineLog = (data) => api.post('/routine-logs', data);
export const deleteAllRoutineLogs = () => api.delete('/routine-logs');