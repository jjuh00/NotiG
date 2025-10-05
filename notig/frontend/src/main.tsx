import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import useUser from './hooks/useUser.ts';
import { UserProvider } from './context/UserContext.tsx';
import App from './App.tsx';
import Register from './pages/Register.tsx';
import Dashboard from './pages/Dashboard.tsx';
import UserProfile from './pages/UserProfile.tsx';
import "./styles/global.css";

const AppRoutes = () => {
  const { userId } = useUser();

  return (
    <Routes>
      <Route path='/' element={<App />} />
      <Route path="/register" element={<Register />} />
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/settings" element={<UserProfile userId={userId!} />} />
    </Routes>
  );
}


createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <UserProvider>
      <Router>
        <AppRoutes />
      </Router>
    </UserProvider>
  </StrictMode>,
);