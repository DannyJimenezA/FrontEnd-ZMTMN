import React, { useEffect, useState } from 'react';
import { EnvelopeIcon, LockClosedIcon, EyeIcon, EyeSlashIcon } from '@heroicons/react/24/outline';
import { useNavigate } from 'react-router-dom';
import ApiRoutes from '../../Components/ApiRoutes';
import ApiService from '../../Components/ApiService';
import image from '../../Img/img05.jpg'
import withReactContent from 'sweetalert2-react-content';
import Swal from 'sweetalert2';
import { useAuth } from './AuthContext';
export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  //const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  const MySwal = withReactContent(Swal);

  const { login: loginWithContext } = useAuth();


  useEffect(() => {
    const listener = (event: StorageEvent) => {
      if (event.key === 'passwordResetSuccess') {
        // Responder a la pestaña que envió la señal
        localStorage.setItem('loginTabReceived', 'true');
        // Opcional: mostrar mensaje o alertar
        alert('Tu contraseña ha sido restablecida con éxito.');
      }
    };

    window.addEventListener('storage', listener);

    return () => {
      window.removeEventListener('storage', listener);
    };
  }, []);


  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email.trim())) {
      await MySwal.fire({
        icon: 'error',
        title: 'Correo inválido',
        text: 'Por favor ingresa un correo electrónico válido.',
        confirmButtonColor: '#ef4444',
      });
      return;
    }

    try {
      const data = await ApiService.post<{ access_token: string }>(
        ApiRoutes.auth.login,
        { email, password }
      );

      loginWithContext(data.access_token);

      await MySwal.fire({
        icon: 'success',
        title: '¡Bienvenido!',
        text: 'Inicio de sesión exitoso.',
        timer: 2000,
        timerProgressBar: true,
        showConfirmButton: false,
        allowOutsideClick: false,
        allowEscapeKey: false,
      });

      navigate('/');
    } catch (error: any) {
      console.error('Login error:', error);

      if (error.data && error.data.message) {
        let apiMessage = error.data.message;

        if (Array.isArray(apiMessage)) {
          apiMessage = apiMessage[0]; // Normaliza si es un array
        }

        if (typeof apiMessage === 'string') {
          const loweredMessage = apiMessage.toLowerCase();

          if (loweredMessage.includes('correo no registrado')) {
            const result = await MySwal.fire({
              icon: 'warning',
              title: 'Correo no registrado',
              text: '¿Deseas crear una cuenta nueva?',
              showCancelButton: true,
              confirmButtonText: 'Registrarme',
              cancelButtonText: 'Cancelar',
              confirmButtonColor: '#2563eb',
              cancelButtonColor: '#ef4444',
            });

            if (result.isConfirmed) {
              navigate('/register');
            }
            return;
          }

          if (loweredMessage.includes('contraseña incorrecta')) {
            await MySwal.fire({
              icon: 'error',
              title: 'Contraseña incorrecta',
              text: 'La contraseña ingresada no es correcta. Intenta de nuevo.',
              confirmButtonColor: '#ef4444',
            });
            return;
          }

          if (loweredMessage.includes('cuenta no activada')) {
            await MySwal.fire({
              icon: 'warning',
              title: 'Cuenta no activada',
              text: 'Debes confirmar tu correo electrónico antes de iniciar sesión.',
              confirmButtonColor: '#f59e0b',
            });
            return;
          }
        }
      }

      // Si llega aquí: error inesperado
      await MySwal.fire({
        icon: 'error',
        title: 'Error de Inicio de Sesión',
        text: 'Ocurrió un error inesperado. Intenta más tarde.',
        confirmButtonColor: '#ef4444',
      });
    }
  };


  const handleBack = () => {
    navigate('/');
  };

  return (
    <div
      className="min-h-screen w-full bg-cover bg-center flex items-center justify-center"
    // style={{ backgroundImage: "url('/src/Img/Img01.jpg')", backgroundSize: "cover", backgroundPosition: "center", backgroundRepeat: "no-repeat", height: "100vh", width: "100vw" }}
    >
      <div className="absolute inset-0 w-full h-full">
        <img src={image} alt="Background" className="w-full h-full object-cover" />
      </div>
      <div className="bg-white bg-opacity-0 backdrop-blur-lg shadow-2xl rounded-lg p-10 w-full max-w-md">
        <h2 className="text-3xl font-extrabold text-black mb-8 text-center">
          Iniciar sesión
        </h2>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="email-address" className="block text-sm font-medium text-black mb-2">
              Correo electrónico
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <EnvelopeIcon className="h-5 w-5 text-gray-900" aria-hidden="true" />
              </div>
              <input
                id="email-address"
                maxLength={60}
                name="email"
                type="text"
                autoComplete="email"
                required
                className="appearance-none block w-full px-3 py-3 pl-10 border border-gray-900 rounded-lg placeholder-gray-900 bg-white text-black focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                placeholder="Ingrese su correo electrónico"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-black mb-2">
              Contraseña
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <LockClosedIcon className="h-5 w-5 text-gray-900" aria-hidden="true" />
              </div>
              <input
                id="password"
                maxLength={25}
                name="password"
                type={showPassword ? 'text' : 'password'}
                autoComplete="current-password"
                required
                className="appearance-none block w-full px-3 py-3 pl-10 border border-gray-900 rounded-lg placeholder-gray-900 bg-white text-black focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                placeholder="Ingrese su contraseña"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 pr-3 flex items-center focus:outline-none"
              >
                {showPassword ? (
                  <EyeSlashIcon className="h-5 w-5 text-gray-900 hover:text-gray-400" aria-hidden="true" />
                ) : (
                  <EyeIcon className="h-5 w-5 text-gray-900 hover:text-gray-400" aria-hidden="true" />
                )}
              </button>
            </div>
          </div>



          <div>
            {/* <button
              type="submit"
              className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-black bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Iniciar sesión
            </button> */}
            <button
              type="submit"
              className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Iniciar sesión
            </button>
            <button
              onClick={handleBack}
              className="w-full mt-2 px-4 py-2 bg-gray-500 text-black font-semibold rounded-lg hover:bg-gray-600 transition-colors"
            >
              Cancelar
            </button>
          </div>

          {/* <div className="text-center text-sm text-white">
            <a href="/forgot-password" className="font-medium text-blue-300 hover:text-blue-400">
              ¿Olvidaste tu contraseña?
            </a>
          </div>
          <div className="text-center text-sm text-black">
            <span className="text-gray-300">¿No tienes una cuenta?</span>
            {' '}
            <a href="/register" className="font-medium text-blue-300 hover:text-blue-400">
              Regístrate aquí
            </a>
          </div> */}
                    <div className="text-center text-sm text-white drop-shadow-sm">
            <a href="/forgot-password" className="font-medium text-white hover:text-blue-400">
              ¿Olvidaste tu contraseña?
            </a>
          </div>
          <div className="text-center text-sm text-black drop-shadow-sm">
            <span className="text-black">¿No tienes una cuenta?</span>{' '}
            <a href="/register" className="font-medium text-white hover:text-blue-400">
              Regístrate aquí
            </a>
          </div>
        </form>
      </div>
    </div>



  );

}
