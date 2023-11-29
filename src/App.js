import './App.css';
import React from 'react';
import { BrowserRouter, Route, Routes, Outlet } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import Dashboard from './pages/Dashboard';
import Pacientes from './pages/pacientes';
import Demo from './pages/Agenda';
import Login from './pages/Login';
import AjustesClinica from './pages/Ajuste';
import PatientPage from './components/PacienteData';
import FinancePage from './pages/Financeiro'

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
            <Route path="agenda" element={<Demo />} />
            <Route path="paciente" element={<Pacientes />} />
            <Route path="paciente/detalhes/:id" element={<PatientPage />} />
            <Route path="financeiro" element={<FinancePage />} />
            <Route path="ajustes" element={<AjustesClinica />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
