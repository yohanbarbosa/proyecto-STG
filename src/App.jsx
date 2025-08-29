import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import './pages/Auth/login.jsx' 
import Login from './pages/Auth/login.jsx';
import ForgotPassword from './pages/Auth/forgotPassword.jsx';
import Register from './pages/Auth/register.jsx';



function App() {
  const [count, setCount] = useState(0)

  return (
  

  //<ForgotPassword/>
  // <Login/>
    <Register/>

  )
}

export default App
