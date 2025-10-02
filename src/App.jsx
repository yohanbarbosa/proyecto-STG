import { useState } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Dashboard from './pages/Layouts/Dashboard.jsx';
import Tramites from "./pages/Tramites/tramites.jsx";
import './index.css';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/Dashboard" element={<Dashboard />}></Route>
        <Route path="/Tramites" element={<Tramites />}></Route>
      </Routes>
    </BrowserRouter>
  );
}
export default App;
