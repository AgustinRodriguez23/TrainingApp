import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getRoutines, deleteRoutine } from '../services/routine.service';
import RoutineForm from './routine.form';

function RoutineList() {
  const [routines, setRoutines] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editingRoutine, setEditingRoutine] = useState(null);

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

  const handleUpdated = (updatedRoutine) => {
    setRoutines((prev) =>
      prev.map((r) => (r._id === updatedRoutine._id ? updatedRoutine : r))
    );
    setEditingRoutine(null);
  };

  const handleDelete = async (id) => {
    const confirmed = window.confirm('¿Seguro que querés borrar esta rutina?');
    if (!confirmed) return;

    try {
      await deleteRoutine(id);
      setRoutines((prev) => prev.filter((r) => r._id !== id));
      if (editingRoutine?._id === id) setEditingRoutine(null);
    } catch (err) {
      alert(err.response?.data?.message || err.message);
    }
  };

  if (loading) return <p>Cargando rutinas...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <div>
      <RoutineForm
        onCreated={handleCreated}
        onUpdated={handleUpdated}
        editingRoutine={editingRoutine}
        onCancelEdit={() => setEditingRoutine(null)}
      />

      <h1>Mis rutinas</h1>
      {routines.length === 0 && <p>No hay rutinas todavía.</p>}
      <ul>
        {routines.map((routine) => (
          <li key={routine._id}>
            <Link to={`/routines/${routine._id}`}>
              <strong>{routine.name}</strong> — {routine.day}
            </Link>
            {' '}
            <button onClick={() => setEditingRoutine(routine)}>Editar</button>
            {' '}
            <button onClick={() => handleDelete(routine._id)}>Borrar</button>
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