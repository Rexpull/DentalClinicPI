import './App.css';
import React from 'react';
import { BrowserRouter, Route, Routes, Outlet } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import Dashboard from './pages/Dashboard';
import About from './pages/About';
import Comment from './pages/Comment';
import Analytics from './pages/Analytics';
import Product from './pages/Product';
import Demo from './pages/Agenda';
import Login from './pages/Login';

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
            <Route path="about" element={<About />} />
            <Route path="comment" element={<Comment />} />
            <Route path="analytics" element={<Analytics />} />
            <Route path="product" element={<Product />} />
            <Route path="agenda" element={<Demo />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
