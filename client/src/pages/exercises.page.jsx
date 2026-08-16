import { useEffect, useState } from 'react';
import { getExercises, deleteExercise } from '../services/exercise.service';
import ExerciseForm from './exercise.form';

function ExercisesPage() {
  const [exercises, setExercises] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingExercise, setEditingExercise] = useState(null);

  const loadExercises = () => {
    setLoading(true);
    getExercises()
      .then((res) => setExercises(res.data))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadExercises();
  }, []);

  const handleCreated = (newExercise) => {
    setExercises((prev) => [...prev, newExercise]);
  };

  const handleUpdated = (updatedExercise) => {
    setExercises((prev) =>
      prev.map((ex) => (ex._id === updatedExercise._id ? updatedExercise : ex))
    );
    setEditingExercise(null);
  };

  const handleDelete = async (id) => {
    const confirmed = window.confirm('¿Seguro que querés borrar este ejercicio?');
    if (!confirmed) return;

    try {
      await deleteExercise(id);
      setExercises((prev) => prev.filter((ex) => ex._id !== id));
      if (editingExercise?._id === id) setEditingExercise(null);
    } catch (err) {
      alert(err.response?.data?.message || err.message);
    }
  };

  return (
    <div>
      <ExerciseForm
        onCreated={handleCreated}
        onUpdated={handleUpdated}
        editingExercise={editingExercise}
        onCancelEdit={() => setEditingExercise(null)}
      />

      <h2>Ejercicios</h2>
      {loading ? (
        <p>Cargando...</p>
      ) : (
        <ul>
          {exercises.map((ex) => (
            <li key={ex._id}>
              {ex.name} {ex.muscleGroup && `— ${ex.muscleGroup}`}
              {' '}
              <button onClick={() => setEditingExercise(ex)}>Editar</button>
              {' '}
              <button onClick={() => handleDelete(ex._id)}>Borrar</button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default ExercisesPage;