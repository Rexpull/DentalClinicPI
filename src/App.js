import './App.css';
import React from 'react';
import { BrowserRouter, Route, Routes, Outlet } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import Comment from './pages/Ajustes';
import Financeiro from './pages/Financeiro';
import Demo from './pages/Agenda';
import Login from './pages/Login';
import Pacientes from './pages/Pacientes';
import Inicio from './pages/Inicio';
import Ajustes from './pages/Ajustes';

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
            <Route path="Inicio" element={<Inicio />} />
            <Route path="Pacientes" element={<Pacientes />} />
            <Route path="Ajustes" element={<Ajustes />} />
            <Route path="Financeiro" element={<Financeiro />} />
            <Route path="Agenda" element={<Demo />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
