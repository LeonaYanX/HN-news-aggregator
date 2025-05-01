// Импорт необходимых модулей и компонентов.
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Header from './components/Header';
import Home from './pages/HomePage';
import NewPage from './pages/NewPage';
import ThreadsPage from './pages/ThreadsPage';
import PastPage from './pages/PastPage';
import CommentsPage from './pages/CommentsPage';
import AskPage from './pages/AskPage';
import ShowPage from './pages/ShowPage';
import JobsPage from './pages/JobsPage';
import SubmitPage from './pages/SubmitPage';
import LoginPage from './pages/LoginPage';
import ProfilePage from './pages/ProfilePage';
import PrivateRoute from './components/PrivateRoute';
import WelcomePage from './pages/WelcomePage';

// Компонент приложения, в котором объявляются маршруты
function App() {
  return (
    <Router>
      <Header />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/new" element={<NewPage />} />
        <Route path="/threads" element={<ThreadsPage />} />
        <Route path="/past" element={<PastPage />} />
        <Route path="/comments" element={<CommentsPage />} />
        <Route path="/ask" element={<AskPage />} />
        <Route path="/show" element={<ShowPage />} />
        <Route path="/jobs" element={<JobsPage />} />
        <Route path="/welcome" element={<WelcomePage />} />
        {/* Приватные маршруты обёрнуты в компонент PrivateRoute,
            который проверяет, авторизован ли пользователь */}
        <Route
          path="/submit"
          element={
            <PrivateRoute>
              <SubmitPage />
            </PrivateRoute>
          }
        />

        <Route path="/auth" element={<LoginPage />} />
        {/* Редиректы, если пользователь попадает на /login или /register */}
        <Route path="/login" element={<Navigate to="/auth" />} />
        <Route path="/register" element={<Navigate to="/auth" />} />

        <Route
          path="/profile"
          element={
            <PrivateRoute>
              <ProfilePage />
            </PrivateRoute>
          }
        />
      </Routes>
    </Router>
  );
}

export default App;
