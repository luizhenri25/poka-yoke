import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Layout';
import Home from './pages/Home';
import Busca from './pages/Busca';
import JIT from './pages/JIT';
import PecasCoelho from './pages/PecasCoelho';
import SkillMatrix from './pages/SkillMatrix';
import GeradorDocumentos from './pages/GeradorDocumentos';
import AnalyticsEngenharia from './pages/AnalyticsEngenharia';
import Visualizador3D from './pages/Visualizador3D';
import Login from './pages/Login';
import GestaoUsuarios from './pages/GestaoUsuarios';

function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/" element={<Layout />}>
        <Route index element={<Home />} />
        <Route path="busca" element={<Busca />} />
        <Route path="jit" element={<JIT />} />
        <Route path="pecas-coelho" element={<PecasCoelho />} />
        <Route path="matriz" element={<SkillMatrix />} />
        <Route path="gerador-documentos" element={<GeradorDocumentos />} />
        <Route path="analytics" element={<AnalyticsEngenharia />} />
        <Route path="visualizador-3d" element={<Visualizador3D />} />
        <Route path="gestao-usuarios" element={<GestaoUsuarios />} />
      </Route>
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default App;
