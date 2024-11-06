import { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Bars3Icon, XMarkIcon, UserIcon } from '@heroicons/react/24/outline';
import { jwtDecode } from 'jwt-decode';

interface NavbarProps {
  isFixed?: boolean;
}

interface DecodedToken {
  email: string;
}

export default function Navbar({ isFixed = false }: NavbarProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSolicitudesDropdownOpen, setIsSolicitudesDropdownOpen] = useState(false); // Estado para "Realizar Solicitudes"
  const [isUserDropdownOpen, setIsUserDropdownOpen] = useState(false); // Estado para el dropdown de usuario
  const [isMobileDropdownOpen, setIsMobileDropdownOpen] = useState(false); // Estado para dropdown en modo móvil
  const [prevScrollPos, setPrevScrollPos] = useState(0);
  const [visible, setVisible] = useState(true);
  const hideTimeout = useRef<ReturnType<typeof setTimeout> | null>(null); 
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const navigate = useNavigate();

  // Verificar si el usuario está autenticado
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const decodedToken: DecodedToken = jwtDecode(token);
        setUserEmail(decodedToken.email);
        setIsAuthenticated(true);
      } catch (error) {
        console.error('Error decoding token:', error);
        setIsAuthenticated(false);
        setUserEmail(null);
      }
    }
  }, []);

  // Función para manejar el cierre de sesión
  const handleLogout = () => {
    localStorage.removeItem('token');
    setIsAuthenticated(false);
    setUserEmail(null);
    navigate('/');
  };

  const navbarClasses = `
    w-full bg-white shadow-md transition-all duration-300 z-50
    ${isFixed ? 'fixed' : 'sticky'} top-0
    ${visible ? 'translate-y-0' : '-translate-y-full'}
  `;

  return (
    <nav className={navbarClasses}>
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center py-4">
          <Link to="/" className="text-2xl font-bold text-blue-600">Inicio</Link>

          {/* Desktop menu */}
          <div className="hidden md:flex space-x-8">
            <Link to="/mis-citas" className="text-gray-600 hover:text-blue-600">Citas</Link>
            <Link to="/usuario-denuncia" className="text-gray-600 hover:text-blue-600">Denuncias</Link>

            {/* Dropdown para "Realizar Solicitudes" */}
            <div 
              onClick={() => {
                setIsSolicitudesDropdownOpen(!isSolicitudesDropdownOpen);
                setIsUserDropdownOpen(false);
              }} 
              className="relative dropdown-container"
            >
              <button className="text-gray-600 hover:text-blue-600">
                Realizar Solicitudes
              </button>
              {isSolicitudesDropdownOpen && (
                <div className="absolute top-full mt-2 bg-white shadow-lg rounded-md w-48">
                  <Link to="/usuario-concesion" className="block px-4 py-2 text-gray-600 hover:text-blue-600 hover:bg-gray-100">
                    Concesiones
                  </Link>
                  <Link to="/usuario-prorroga" className="block px-4 py-2 text-gray-600 hover:text-blue-600 hover:bg-gray-100">
                    Prorrogas
                  </Link>
                  <Link to="/usuario-precario" className="block px-4 py-2 text-gray-600 hover:text-blue-600 hover:bg-gray-100">
                    Uso Precario
                  </Link>
                  <Link to="/usuario-plano" className="block px-4 py-2 text-gray-600 hover:text-blue-600 hover:bg-gray-100">
                    Revisión de Planos
                  </Link>
                  <Link to="/usuario-expediente" className="block px-4 py-2 text-gray-600 hover:text-blue-600 hover:bg-gray-100">
                    Copia de Expediente
                  </Link>
                </div>
              )}
            </div>

            <Link to="/mis-solicitudes" className="text-gray-600 hover:text-blue-600">Mis Solicitudes</Link>

            {/* Condición de usuario autenticado */}
            {isAuthenticated ? (
              <div className="relative">
                <button
                  onClick={() => {
                    setIsUserDropdownOpen(!isUserDropdownOpen);
                    setIsSolicitudesDropdownOpen(false);
                  }}
                  className="flex items-center space-x-2 text-gray-600 hover:text-blue-600 focus:outline-none"
                >
                  <UserIcon className="h-6 w-6" />
                </button>
                {isUserDropdownOpen && (
                  <div className="absolute right-0 mt-2 bg-white shadow-lg rounded-md w-48">
                    <div className="px-4 py-2 text-gray-700 border-b">{userEmail}</div>
                    <button
                      onClick={handleLogout}
                      className="w-full text-left px-4 py-2 text-gray-600 hover:text-blue-600 hover:bg-gray-100"
                    >
                      Cerrar sesión
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <Link to="/login" className="text-gray-600 hover:text-blue-600">Iniciar Sesión</Link>
            )}
          </div>

          {/* Mobile menu button */}
          <button 
            className="md:hidden"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? (
              <XMarkIcon className="h-6 w-6 text-gray-600" />
            ) : (
              <Bars3Icon className="h-6 w-6 text-gray-600" />
            )}
          </button>
        </div>
        
        {/* Mobile menu */}
        {isMenuOpen && (
          <div className="md:hidden py-4 space-y-2">
            <Link to="/mis-citas" className="block py-2 px-4 text-gray-600 hover:text-blue-600">Citas</Link>
            <Link to="/usuario-denuncia" className="block py-2 px-4 text-gray-600 hover:text-blue-600">Denuncias</Link>
            
            {/* Dropdown de "Realizar Solicitudes" en móvil */}
            <div className="relative">
              <button
                onClick={() => setIsMobileDropdownOpen(!isMobileDropdownOpen)}
                className="w-full text-left px-4 py-2 text-gray-600 hover:text-blue-600"
              >
                Realizar Solicitudes
              </button>
              {isMobileDropdownOpen && (
                <div className="pl-4">
                  <Link to="/usuario-concesion" className="block py-2 text-gray-600 hover:text-blue-600">Concesiones</Link>
                  <Link to="/usuario-prorroga" className="block py-2 text-gray-600 hover:text-blue-600">Prorrogas</Link>
                  <Link to="/usuario-precario" className="block py-2 text-gray-600 hover:text-blue-600">Uso Precario</Link>
                  <Link to="/usuario-plano" className="block py-2 text-gray-600 hover:text-blue-600">Revisión de Planos</Link>
                </div>
              )}
            </div>

            <Link to="/mis-solicitudes" className="block py-2 px-4 text-gray-600 hover:text-blue-600">Mis Solicitudes</Link>

            {/* Autenticación en modo móvil */}
            {isAuthenticated ? (
              <div className="relative">
                <button
                  onClick={() => setIsUserDropdownOpen(!isUserDropdownOpen)}
                  className="flex items-center w-full text-left px-4 py-2 text-gray-600 hover:text-blue-600 focus:outline-none"
                >
                  <UserIcon className="h-6 w-6 mr-2" /> {userEmail}
                </button>
                {isUserDropdownOpen && (
                  <div className="pl-4">
                    <button
                      onClick={handleLogout}
                      className="w-full text-left px-4 py-2 text-gray-600 hover:text-blue-600 hover:bg-gray-100"
                    >
                      Cerrar sesión
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <Link to="/login" className="block py-2 px-4 text-gray-600 hover:text-blue-600">Iniciar Sesión</Link>
            )}
          </div>
        )}
      </div>
    </nav>
  );
}
