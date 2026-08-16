import { useState, useEffect } from 'react';
import { createExercise, updateExercise } from '../services/exercise.service';

function ExerciseForm({ onCreated, onUpdated, editingExercise, onCancelEdit }) {
  const [name, setName] = useState('');
  const [muscleGroup, setMuscleGroup] = useState('');
  const [description, setDescription] = useState('');
  const [error, setError] = useState(null);
  const [saving, setSaving] = useState(false);

  const isEditing = Boolean(editingExercise);

  // Cuando cambia el ejercicio a editar, precargamos los campos
  useEffect(() => {
    if (editingExercise) {
      setName(editingExercise.name || '');
      setMuscleGroup(editingExercise.muscleGroup || '');
      setDescription(editingExercise.description || '');
    } else {
      setName('');
      setMuscleGroup('');
      setDescription('');
    }
  }, [editingExercise]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    if (!name.trim()) {
      setError('El nombre es obligatorio');
      return;
    }

    setSaving(true);
    try {
      if (isEditing) {
        const res = await updateExercise(editingExercise._id, { name, muscleGroup, description });
        if (onUpdated) onUpdated(res.data);
      } else {
        const res = await createExercise({ name, muscleGroup, description });
        if (onCreated) onCreated(res.data);
        setName('');
        setMuscleGroup('');
        setDescription('');
      }
    } catch (err) {
      setError(err.response?.data?.message || err.message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>{isEditing ? 'Editar ejercicio' : 'Nuevo ejercicio'}</h2>

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
        {saving ? 'Guardando...' : isEditing ? 'Guardar cambios' : 'Crear ejercicio'}
      </button>
      {isEditing && (
        <button type="button" onClick={onCancelEdit}>
          Cancelar
        </button>
      )}
    </form>
  );
}

export default ExerciseForm;