import { Routes, Route } from 'react-router-dom';
import Home from './Home';
import UsuarioConcesion from '../Pages/Usuarios/UsuarioConcesion';
import UsuarioProrroga from '../Pages/Usuarios/UsuarioProrroga';
import UsuarioPrecario from '../Pages/Usuarios/UsuarioPrecario';
import UsuarioPlano from '../Pages/Usuarios/UsuarioPlano';
import UsuarioDenuncia from '../Pages/Usuarios/UsuarioDenuncia';
import UsuarioCita from '../Pages/Usuarios/UsuarioCita';
import UserRequests from '../Pages/Usuarios/UserRequest';
import Login from '../Pages/Auth/Login';
import Register from '../Pages/Auth/Register';
import ForgotPassword from '../Pages/Auth/ForgotPassword';
import ProtectedRoute from './ProtectedRoute';
import { AuthProvider } from '../Pages/Auth/AuthContext';
import UsuarioExpediente from '../Pages/Usuarios/UsuarioExpediente';
import UserAppointments from '../Pages/UsuariosSolicitudes/CitasList';
import CitasList from '../Pages/UsuariosSolicitudes/CitasList';

function AppRoutes() {
  const isAuthenticated = !!localStorage.getItem('token');

  return (
    <AuthProvider>
    <Routes>
      {/* Rutas Publicas */}
      <Route path="/" element={<Home />} />
      <Route path="/usuario-denuncia" element={<UsuarioDenuncia />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/mis-citas" element={<CitasList/>}/>

      {/* Rutas Protegidas */}
      <Route path="/usuario-expediente" element={<ProtectedRoute><UsuarioExpediente/></ProtectedRoute>}/>
      <Route path="/usuario-cita" element={<ProtectedRoute><UsuarioCita /></ProtectedRoute>}/>
      <Route path="/usuario-concesion" element={<ProtectedRoute><UsuarioConcesion /></ProtectedRoute>}/>
      <Route path="/usuario-prorroga" element={<ProtectedRoute><UsuarioProrroga /></ProtectedRoute>}/>
      <Route path="/usuario-precario" element={<ProtectedRoute><UsuarioPrecario /></ProtectedRoute>}/>
      <Route path="/usuario-plano" element={<ProtectedRoute><UsuarioPlano /></ProtectedRoute>}/>
      <Route path="/mis-solicitudes" element={<ProtectedRoute><UserRequests /></ProtectedRoute>}/>
    </Routes>
            
   </AuthProvider>
  );
}

export default AppRoutes;
