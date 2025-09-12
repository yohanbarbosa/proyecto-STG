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
import HookUseContext from './playground/HookUseContext.jsx';
import HookUseActionState from './playground/HookUseActionState.jsx';
import HookUseCallback from './playground/HookUseCallback.jsx';
import HookUseDebugValue from './playground/HookUseDebugValue.jsx';
import HookUseDeferredValue from './playground/HookUseDeferredValue.jsx';
import HookUseId from './playground/HookUseId.jsx';
import HookUseImperativeHandle from './playground/HookUseImperativeHandle.jsx';
import HookUseInsertionEffect from './playground/HookUseInsertionEffect.jsx';
import HookUseMemo from './playground/HookUseMemo.jsx';
import HookUseOptimistic from './playground/HookUseOptimistic.jsx';
import HookUseReducer from './playground/HookUseReducer.jsx';
import HookUseRef from './playground/HookUseRef.jsx';





function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<HomeHooks />}></Route>
        {/* rutas para componentes de hooks */}
        <Route path='/useActionState' element={<HookUseActionState />}></Route>
        <Route path='/useCallbak' element={<HookUseCallback />}></Route>
        <Route path='/useContext' element={<HookUseContext />}></Route>
        <Route path='/useDebugValue' element={<HookUseDebugValue />}></Route>
        <Route path='/useDeferredValue' element={<HookUseDeferredValue />}></Route>
        <Route path='/useEffect' element={<HookUseEffect />}></Route>
        <Route path='/useId' element={<HookUseId />}></Route>
        <Route path='/useImperativeHandle' element={<HookUseImperativeHandle />}></Route>
        <Route path='/useInsertionEffect' element={<HookUseInsertionEffect />}></Route>
        <Route path='/useMemo' element={<HookUseMemo />}></Route>
        <Route path='/useOptimistic' element={<HookUseOptimistic />}></Route>
        <Route path='/useReducer' element={<HookUseReducer />}></Route>

        <Route path='/useRef' element={<HookUseRef />}></Route>
        <Route path='/useState' element={<HookUseState />}></Route>
        <Route path='/useNavigate' element={<HookUseNavigate />}></Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App
