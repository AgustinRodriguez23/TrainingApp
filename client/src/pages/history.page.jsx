import { useEffect, useState } from 'react';
import { getRoutineLogs } from '../services/routine.log.service';

function HistoryPage() {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getRoutineLogs()
      .then((res) => setLogs(res.data))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <p>Cargando historial...</p>;

  return (
    <div>
      <h1>Historial</h1>
      {logs.length === 0 && <p>Todavía no completaste ninguna rutina.</p>}
      <ul>
        {logs.map((log) => (
          <li key={log._id}>
            <strong>{log.routineName}</strong>
            {' — '}
            {new Date(log.completedAt).toLocaleDateString('es-AR', {
              day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit'
            })}
            <ul>
              {log.exercises.map((ex, i) => (
                <li key={i}>
                  {ex.exerciseName} — {ex.sets.length} serie{ex.sets.length !== 1 ? 's' : ''}
                  {ex.sets.some((s) => s.weight > 0) &&
                    ` (hasta ${Math.max(...ex.sets.map((s) => s.weight || 0))}kg)`}
                </li>
              ))}
            </ul>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default HistoryPage;