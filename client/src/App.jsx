import { Routes, Route, Link } from 'react-router-dom';
import ExercisesPage from './pages/exercises.page';
import RoutineList from './pages/routine.list';
import RoutineExecution from './pages/routine.execution';
import LoginPage from './pages/login.page';
import RegisterPage from './pages/register.page';
import ProtectedRoute from './components/ProtectedRoute';
import { useAuth } from './context/AuthContext';

function App() {
  const { user, logout } = useAuth();

  return (
    <div>
      <nav>
        <Link to="/">Rutinas</Link>
        {' | '}
        <Link to="/exercises">Ejercicios</Link>
        {user && (
          <>
            {' | '}
            <span>{user.email}</span>
            {' '}
            <button onClick={logout}>Cerrar sesión</button>
          </>
        )}
      </nav>

      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/" element={<ProtectedRoute><RoutineList /></ProtectedRoute>} />
        <Route path="/exercises" element={<ProtectedRoute><ExercisesPage /></ProtectedRoute>} />
        <Route path="/routines/:id" element={<ProtectedRoute><RoutineExecution /></ProtectedRoute>} />
      </Routes>
    </div>
  );
}

export default App;