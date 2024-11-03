import './App.css'
import Home from './Pages/Home'
import {BrowserRouter as Router, Route, Routes } from 'react-router-dom'
import UsuarioConcesion from './Pages/Usuarios/UsuarioConcesion'
import UsuarioProrroga from './Pages/Usuarios/UsuarioProrroga'
import UsuarioPrecario from './Pages/Usuarios/UsuarioPrecario'
import UsuarioPlano from './Pages/Usuarios/UsuarioPlano'

function App() {


  return (
    <Router>
    <Routes>
       <Route path="/" element={<Home />} />
       <Route path="/usuario-concesion" element={<UsuarioConcesion />} />
       <Route path="/usuario-prorroga" element={<UsuarioProrroga />} />
       <Route path="/usuario-precario" element={<UsuarioPrecario />} />
       <Route path="/usuario-plano" element={<UsuarioPlano />} />
       {/* <Route path="/usuario-cita" element={<UsuarioCita />} />
       <Route path="/usuario-denuncia" element={<UsuarioDenuncia />} /> */}


    </Routes>
    </Router>
  )
}

export default App
