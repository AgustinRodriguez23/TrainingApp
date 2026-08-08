import { Routes, Route, Link } from 'react-router-dom';
import ExercisesPage from './pages/exercises.page';
import RoutineList from './pages/routine.list';

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
      </Routes>
    </div>
  );
}

export default App;