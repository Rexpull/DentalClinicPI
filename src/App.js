import './App.css';
import React from 'react';
import { BrowserRouter, Route, Routes, Outlet } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import Dashboard from './pages/Dashboard';
import Pacientes from './pages/pacientes';
import Comment from './pages/Comment';
import Analytics from './pages/Analytics';

import Demo from './pages/agenda';
import Login from './pages/Login';
import AjustesClinica from './pages/Ajuste';

const App = () => {
  return (
    <div>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route
            path="/app"
            element={
              <Sidebar>
                <Outlet />
              </Sidebar>
            }
          >
            {/* Remova a barra inicial em /dashboard */}
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="paciente" element={<Pacientes />} />
            <Route path="comment" element={<Comment />} />
            <Route path="analytics" element={<Analytics />} />
            <Route path="ajustes" element={<AjustesClinica />} />
            <Route path="agenda" element={<Demo />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
