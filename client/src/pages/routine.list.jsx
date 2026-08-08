import { useEffect, useState } from 'react';
import { getRoutines } from '../services/routine.service';
import RoutineForm from './routine.form';

function RoutineList() {
  const [routines, setRoutines] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const loadRoutines = () => {
    setLoading(true);
    getRoutines()
      .then((res) => setRoutines(res.data))
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadRoutines();
  }, []);

  const handleCreated = (newRoutine) => {
    setRoutines((prev) => [newRoutine, ...prev]);
  };

  if (loading) return <p>Cargando rutinas...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <div>
      <RoutineForm onCreated={handleCreated} />

      <h1>Mis rutinas</h1>
      {routines.length === 0 && <p>No hay rutinas todavía.</p>}
      <ul>
        {routines.map((routine) => (
          <li key={routine._id}>
            <strong>{routine.name}</strong> — {routine.day}
            <ul>
              {routine.exercises.map((ex, i) => (
                    <li key={i}>
                    {ex.exercise?.name ?? 'Ejercicio no encontrado'} — {ex.series} series,{' '}
                    {ex.measureType === 'reps' ? `${ex.reps} reps` : `${ex.executionTime}s`},{' '}
                    {ex.restBetweenSeries}s descanso
                </li>
              ))}
            </ul>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default RoutineList;