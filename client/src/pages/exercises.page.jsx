import { useEffect, useState } from 'react';
import { getExercises } from '../services/exercise.service';
import ExerciseForm from './exercise.form';

function ExercisesPage() {
  const [exercises, setExercises] = useState([]);
  const [loading, setLoading] = useState(true);

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

  return (
    <div>
      <ExerciseForm onCreated={handleCreated} />

      <h2>Ejercicios</h2>
      {loading ? (
        <p>Cargando...</p>
      ) : (
        <ul>
          {exercises.map((ex) => (
            <li key={ex._id}>
              {ex.name} {ex.muscleGroup && `— ${ex.muscleGroup}`}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default ExercisesPage;