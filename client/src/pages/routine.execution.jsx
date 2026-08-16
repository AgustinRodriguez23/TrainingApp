import { useEffect, useState, useCallback } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getRoutineById } from '../services/routine.service';
import useTimer from '../hooks/useTimer';

// Fases posibles dentro de un ejercicio
const PHASE = {
  EXECUTION: 'execution',
  REST_BETWEEN_SERIES: 'restBetweenSeries',
  REST_AFTER_EXERCISE: 'restAfterExercise'
};

function RoutineExecution() {
  const { id } = useParams();
  const [routine, setRoutine] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [exerciseIndex, setExerciseIndex] = useState(0);
  const [seriesNumber, setSeriesNumber] = useState(1);
  const [phase, setPhase] = useState(PHASE.EXECUTION);
  const [finished, setFinished] = useState(false);

  useEffect(() => {
    getRoutineById(id)
      .then((res) => setRoutine(res.data))
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [id]);

  const currentBlock = routine?.exercises[exerciseIndex];
  const isLastSeries = currentBlock && seriesNumber >= currentBlock.series;
  const isLastExercise = routine && exerciseIndex >= routine.exercises.length - 1;

  // Avanza al siguiente paso de la máquina de estados
  const advance = useCallback(() => {
    if (!currentBlock) return;

    if (phase === PHASE.EXECUTION) {
      if (!isLastSeries) {
        setPhase(PHASE.REST_BETWEEN_SERIES);
      } else {
        setPhase(PHASE.REST_AFTER_EXERCISE);
      }
      return;
    }

    if (phase === PHASE.REST_BETWEEN_SERIES) {
      setSeriesNumber((n) => n + 1);
      setPhase(PHASE.EXECUTION);
      return;
    }

    if (phase === PHASE.REST_AFTER_EXERCISE) {
      if (isLastExercise) {
        setFinished(true);
      } else {
        setExerciseIndex((i) => i + 1);
        setSeriesNumber(1);
        setPhase(PHASE.EXECUTION);
      }
    }
  }, [phase, isLastSeries, isLastExercise, currentBlock]);

  // Duración del timer según la fase actual (0 si es fase de "reps", se maneja manual)
  const getPhaseSeconds = () => {
    if (!currentBlock) return 0;
    if (phase === PHASE.EXECUTION) {
      return currentBlock.measureType === 'time' ? currentBlock.executionTime : 0;
    }
    if (phase === PHASE.REST_BETWEEN_SERIES) return currentBlock.restBetweenSeries;
    if (phase === PHASE.REST_AFTER_EXERCISE) return currentBlock.restAfterExercise;
    return 0;
  };

  const timer = useTimer(getPhaseSeconds(), advance);

  // Cada vez que cambia la fase o el ejercicio, reiniciamos y arrancamos el timer
  // (excepto en fase EXECUTION con measureType 'reps', que se controla a mano)
  useEffect(() => {
    if (!currentBlock) return;
    const seconds = getPhaseSeconds();
    const isManualReps = phase === PHASE.EXECUTION && currentBlock.measureType === 'reps';

    if (isManualReps) {
      timer.reset(0);
    } else {
      timer.start(seconds);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [exerciseIndex, seriesNumber, phase]);

  if (loading) return <p>Cargando rutina...</p>;
  if (error) return <p>Error: {error}</p>;
  if (!routine) return <p>Rutina no encontrada</p>;

  if (finished) {
  return (
    <div className="finished-screen">
      <h1>¡Rutina completada! </h1>
      <p>Terminaste "{routine.name}"</p>
      <br />
      <Link to="/">
        <button type="submit">Volver a rutinas</button>
      </Link>
    </div>
  );
}
  const exerciseName = currentBlock?.exercise?.name ?? 'Ejercicio no encontrado';

  return (
    <div>
      <h1>{routine.name}</h1>
        <div className="exec-header">
        <span className="exec-eyebrow">
            Ejercicio {exerciseIndex + 1} de {routine.exercises.length}
        </span>
        </div>

        <h2>{exerciseName}</h2>
        <p>
        Serie {seriesNumber} de {currentBlock.series}
        {currentBlock.weight > 0 && ` — ${currentBlock.weight}kg`}
        </p>

      {phase === PHASE.EXECUTION && (
        <div className="phase-card phase-execution">
            <h3>Ejecución</h3>
            {currentBlock.measureType === 'reps' ? (
            <div>
                <p className="phase-reps">{currentBlock.reps} reps</p>
                <button onClick={advance}>Listo, siguiente</button>
            </div>
            ) : (
            <p className="timer-display">{timer.secondsLeft}s</p>
            )}
        </div>
        )}

      {phase === PHASE.REST_BETWEEN_SERIES && (
        <div className="phase-card phase-rest">
            <h3>Descanso entre series</h3>
            <p className="timer-display">{timer.secondsLeft}s</p>
            <button onClick={advance}>Saltar descanso</button>
        </div>
        )}

        {phase === PHASE.REST_AFTER_EXERCISE && (
        <div className="phase-card phase-rest">
            <h3>Descanso — próximo ejercicio</h3>
            <p className="timer-display">{timer.secondsLeft}s</p>
            <button onClick={advance}>Saltar descanso</button>
        </div>
        )}
    </div>
  );
}

export default RoutineExecution;