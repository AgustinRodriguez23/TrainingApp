import api from './api';

export const getExercises = () => api.get('/exercises');
export const getExerciseById = (id) => api.get(`/exercises/${id}`);
export const createExercise = (data) => api.post('/exercises', data);
export const updateExercise = (id, data) => api.patch(`/exercises/${id}`, data);
export const deleteExercise = (id) => api.delete(`/exercises/${id}`);