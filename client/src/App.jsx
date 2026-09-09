import { Routes, Route, Link } from 'react-router-dom';
import ExercisesPage from './pages/exercises.page';
import RoutineList from './pages/routine.list';
import RoutineExecution from './pages/routine.execution';
import LoginPage from './pages/login.page';
import RegisterPage from './pages/register.page';
import ProtectedRoute from './components/ProtectedRoute';
import { useAuth } from './context/AuthContext';
import HistoryPage from './pages/history.page';

function App() {
  const { user, logout } = useAuth();

  return (
    <div>
      <nav>
        <div className="nav-links">
          <Link to="/">Rutinas</Link>
          <Link to="/exercises">Ejercicios</Link>
          <Link to="/history">Historial</Link>
        </div>
        {user && (
          <div className="nav-user">
            <span className="nav-email">{user.email}</span>
            <button onClick={logout}>Cerrar sesión</button>
          </div>
        )}
      </nav>

      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/" element={<ProtectedRoute><RoutineList /></ProtectedRoute>} />
        <Route path="/exercises" element={<ProtectedRoute><ExercisesPage /></ProtectedRoute>} />
        <Route path="/routines/:id" element={<ProtectedRoute><RoutineExecution /></ProtectedRoute>} />
        <Route path="/history" element={<ProtectedRoute><HistoryPage /></ProtectedRoute>} />
      </Routes>
    </div>
  );
}

export default App;