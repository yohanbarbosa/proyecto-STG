import { useState } from 'react';
import reactLogo from './assets/react.svg';
import viteLogo from '/vite.svg';
import './App.css';
import './pages/Auth/login.jsx';
import Login from './pages/Auth/login.jsx';
import ForgotPassword from './pages/Auth/forgotPassword.jsx';
import Register from './pages/Auth/register.jsx';
import HookUseState from './playground/HoookUseState.jsx';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import HomeHooks from './playground/HomeHooks.jsx';
import HookUseNavigate from './playground/HookUseNavigate.jsx';
import HookUseEffect from './playground/HookUseEffect.jsx';




function App() {
  const [count, setCount] = useState(0)

  return (
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<HomeHooks />}></Route>
        {/* rutas para componentes de hooks */}
        <Route path='/useState' element={<HookUseState />}></Route>
        <Route path='/useNavigate' element={<HookUseNavigate />}></Route>
        <Route path='/useEffect' element={<HookUseEffect />}></Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App
