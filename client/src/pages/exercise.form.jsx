import { useState } from 'react';
import { createExercise } from '../services/exercise.service';

function ExerciseForm({ onCreated }) {
  const [name, setName] = useState('');
  const [muscleGroup, setMuscleGroup] = useState('');
  const [description, setDescription] = useState('');
  const [error, setError] = useState(null);
  const [saving, setSaving] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    if (!name.trim()) {
      setError('El nombre es obligatorio');
      return;
    }

    setSaving(true);
    try {
      const res = await createExercise({ name, muscleGroup, description });
      setName('');
      setMuscleGroup('');
      setDescription('');
      if (onCreated) onCreated(res.data); // avisa al padre que se creó, por si quiere refrescar la lista
    } catch (err) {
      setError(err.response?.data?.message || err.message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>Nuevo ejercicio</h2>

      {error && <p style={{ color: 'red' }}>{error}</p>}

      <div>
        <label>Nombre</label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Ej: Sentadilla"
        />
      </div>

      <div>
        <label>Grupo muscular</label>
        <input
          type="text"
          value={muscleGroup}
          onChange={(e) => setMuscleGroup(e.target.value)}
          placeholder="Ej: Piernas"
        />
      </div>

      <div>
        <label>Descripción (opcional)</label>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
      </div>

      <button type="submit" disabled={saving}>
        {saving ? 'Guardando...' : 'Crear ejercicio'}
      </button>
    </form>
  );
}

export default ExerciseForm;