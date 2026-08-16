import { Routes, Route, Link } from 'react-router-dom';
import ExercisesPage from './pages/exercises.page';
import RoutineList from './pages/routine.list';
import RoutineExecution from './pages/routine.execution';

function App() {
  return (
    <div>
      <nav>
        <Link to="/">Rutinas</Link>
        {' | '}
        <Link to="/exercises">Ejercicios</Link>
      </nav>

      <Routes>
        <Route path="/" element={<RoutineList />} />
        <Route path="/exercises" element={<ExercisesPage />} />
        <Route path="/routines/:id" element={<RoutineExecution />} />
      </Routes>
    </div>
  );
}

export default App;