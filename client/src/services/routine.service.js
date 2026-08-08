import api from './api';

export const getRoutines = () => api.get('/routines');
export const getRoutineById = (id) => api.get(`/routines/${id}`);
export const createRoutine = (data) => api.post('/routines', data);
export const updateRoutine = (id, data) => api.patch(`/routines/${id}`, data);
export const deleteRoutine = (id) => api.delete(`/routines/${id}`);