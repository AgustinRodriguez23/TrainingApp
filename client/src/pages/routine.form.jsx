import { useState, useEffect } from 'react';
import { getExercises } from '../services/exercise.service';
import { createRoutine } from '../services/routine.service';

const emptyBlock = {
  exercise: '',
  series: 3,
  weight: 0,
  measureType: 'reps',
  reps: 10,
  executionTime: 30,
  restBetweenSeries: 30,
  restAfterExercise: 60
};

function RoutineForm({ onCreated }) {
  const [name, setName] = useState('');
  const [day, setDay] = useState('');
  const [blocks, setBlocks] = useState([{ ...emptyBlock }]);
  const [exercisesList, setExercisesList] = useState([]);
  const [error, setError] = useState(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    getExercises().then((res) => setExercisesList(res.data));
  }, []);

    const updateBlock = (index, field, value) => {
    setBlocks((prev) =>
        prev.map((block, i) => (i === index ? { ...block, [field]: value } : block))
    );
    };

    const updateBlockNumber = (index, field, rawValue) => {
    const value = Math.max(0, Number(rawValue) || 0);
    updateBlock(index, field, value);
    };

  const addBlock = () => {
    setBlocks((prev) => [...prev, { ...emptyBlock }]);
  };

  const removeBlock = (index) => {
    setBlocks((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    if (!name.trim()) {
      setError('El nombre de la rutina es obligatorio');
      return;
    }
    if (blocks.some((b) => !b.exercise)) {
      setError('Todos los bloques necesitan un ejercicio seleccionado');
      return;
    }

    const cleanedBlocks = blocks.map((b) => {
      const base = {
        exercise: b.exercise,
        series: b.series,
        weight: b.weight,
        measureType: b.measureType,
        restBetweenSeries: b.restBetweenSeries,
        restAfterExercise: b.restAfterExercise
      };
      if (b.measureType === 'reps') {
        base.reps = b.reps;
      } else {
        base.executionTime = b.executionTime;
      }
      return base;
    });

    setSaving(true);
    try {
      const res = await createRoutine({ name, day, exercises: cleanedBlocks });
      setName('');
      setDay('');
      setBlocks([{ ...emptyBlock }]);
      if (onCreated) onCreated(res.data);
    } catch (err) {
      setError(err.response?.data?.message || err.message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>Nueva rutina</h2>

      {error && <p style={{ color: 'red' }}>{error}</p>}

      <div>
        <label>Nombre</label>
        <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Ej: Espalda" />
      </div>

      <div>
        <label>Día</label>
        <input value={day} onChange={(e) => setDay(e.target.value)} placeholder="Ej: Jueves" />
      </div>

      <h3>Ejercicios de la rutina</h3>
      {blocks.map((block, index) => (
        <div key={index} style={{ border: '1px solid #ccc', padding: 10, marginBottom: 10 }}>
          <div>
            <label>Ejercicio</label>
            <select
              value={block.exercise}
              onChange={(e) => updateBlock(index, 'exercise', e.target.value)}
            >
              <option value="">Seleccionar...</option>
              {exercisesList.map((ex) => (
                <option key={ex._id} value={ex._id}>
                  {ex.name}
                </option>
              ))}
            </select>
          </div>

            <div>
                <label>Series</label>
                <input
                type="number"
                min="0"
                value={block.series}
                onChange={(e) => updateBlockNumber(index, 'series', e.target.value)}
            />
            </div>

            <div>
            <label>Peso (kg)</label>
            <input
                type="number"
                min="0"
                value={block.weight}
                onChange={(e) => updateBlockNumber(index, 'weight', e.target.value)}
            />
            </div>

          <div>
            <label>Tipo de medición</label>
            <select
              value={block.measureType}
              onChange={(e) => updateBlock(index, 'measureType', e.target.value)}
            >
              <option value="reps">Repeticiones</option>
              <option value="time">Tiempo</option>
            </select>
          </div>

          {block.measureType === 'reps' ? (
            <div>
                <label>Repeticiones</label>
                <input
                type="number"
                min="0"
                value={block.reps}
                onChange={(e) => updateBlockNumber(index, 'reps', e.target.value)}
                />
            </div>
            ) : (
            <div>
                <label>Tiempo de ejecución (seg)</label>
                <input
                type="number"
                min="0"
                value={block.executionTime}
                onChange={(e) => updateBlockNumber(index, 'executionTime', e.target.value)}
                />
            </div>
            )}

            <div>
                <label>Descanso entre series (seg)</label>
                <input
                    type="number"
                    min="0"
                    value={block.restBetweenSeries}
                    onChange={(e) => updateBlockNumber(index, 'restBetweenSeries', e.target.value)}
                />
                </div>

                <div>
                <label>Descanso post-ejercicio (seg)</label>
                <input
                    type="number"
                    min="0"
                    value={block.restAfterExercise}
                    onChange={(e) => updateBlockNumber(index, 'restAfterExercise', e.target.value)}
                />
            </div>

          {blocks.length > 1 && (
            <button type="button" onClick={() => removeBlock(index)}>
              Quitar ejercicio
            </button>
          )}
        </div>
      ))}

      <button type="button" onClick={addBlock}>
        + Agregar ejercicio
      </button>

      <br />
      <br />

      <button type="submit" disabled={saving}>
        {saving ? 'Guardando...' : 'Crear rutina'}
      </button>
    </form>
  );
}

export default RoutineForm;