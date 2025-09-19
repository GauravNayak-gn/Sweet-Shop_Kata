import { Routes, Route } from 'react-router-dom';
import DashboardPage from './pages/DashboardPage'; // Create this file next
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';

// Create placeholder pages for now
const DashboardPage = () => <h2>Dashboard</h2>;
const LoginPage = () => <h2>Login</h2>;
const RegisterPage = () => <h2>Register</h2>;

function App() {
  return (
    <div>
      <h1>Sweet Shop Management</h1>
      <Routes>
        <Route path="/" element={<DashboardPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
      </Routes>
    </div>
  );
}

export default App;