
// import { useState, useEffect } from 'react';
// import { useLocation, useNavigate } from 'react-router-dom';
// import axios, { AxiosError } from 'axios';
// import ApiRoutes from '../../Components/ApiRoutes';
// import { FaRegEye, FaRegEyeSlash } from 'react-icons/fa'; // Importar iconos para mostrar/ocultar contraseñas

// interface ErrorResponse {
//   message: string;
// }

// const ResetPassword = () => {
//   const query = new URLSearchParams(useLocation().search);
//   const token = query.get('token'); // Obtiene el token de la URL
//   const [newPassword, setNewPassword] = useState('');
//   const [confirmPassword, setConfirmPassword] = useState('');
//   const [showPassword, setShowPassword] = useState(false); // Estado para mostrar/ocultar contraseñas
//   const [message, setMessage] = useState('');
//   const [isSubmitting, setIsSubmitting] = useState(false); // Estado para controlar el botón de envío
//   const navigate = useNavigate();

//   useEffect(() => {
//     // Verifica que el token esté presente en la URL
//     if (!token) {
//       setMessage('Token de restablecimiento no válido o faltante.');
//       console.warn('No se encontró un token de restablecimiento en la URL.');
//     }
//   }, [token]);

//   const validatePassword = (password: string) => {
//     const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/; // Al menos 8 caracteres, una letra y un número
//     return passwordRegex.test(password);
//   };

//   const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
//     e.preventDefault();
//     if (newPassword !== confirmPassword) {
//       setMessage('Las contraseñas no coinciden');
//       return;
//     }

//     if (!validatePassword(newPassword)) {
//       setMessage('La contraseña debe tener al menos 8 caracteres, incluyendo una letra y un número.');
//       return;
//     }

//     setIsSubmitting(true); // Desactiva el botón mientras se envía la solicitud

//     try {
//       const response = await axios.post(`${ApiRoutes.usuarios}/reset-password`, {
//         token, // Incluye el token en el cuerpo si el backend lo requiere
//         newPassword,
//       });
//       setMessage(response.data.message);
//       navigate('/login'); // Redirigir al login después de cambiar la contraseña
//     } catch (error) {
//       const err = error as AxiosError<ErrorResponse>; // Asignamos un tipo específico a `err`
//       if (err.response && err.response.data) {
//         setMessage(err.response.data.message || 'Error al restablecer la contraseña');
//       } else {
//         setMessage('No se pudo conectar con el servidor. Inténtalo más tarde.');
//       }
//     } finally {
//       setIsSubmitting(false); // Reactiva el botón al finalizar la solicitud
//     }
//   };

//   const togglePasswordVisibility = () => {
//     setShowPassword(!showPassword); // Alterna entre mostrar y ocultar contraseñas
//   };

//   return (
//     <div className="reset-password-container">
//       <h2>Restablecer Contraseña</h2>
//       <form onSubmit={handleSubmit}>
//         <div className="password-input-container">
//           <input
//             type={showPassword ? 'text' : 'password'} // Alterna entre texto y contraseña
//             placeholder="Nueva Contraseña"
//             value={newPassword}
//             onChange={(e) => setNewPassword(e.target.value)}
//             required
//           />
//           <span className="password-toggle" onClick={togglePasswordVisibility}>
//             {showPassword ? <FaRegEyeSlash /> : <FaRegEye />}
//           </span>
//         </div>
//         <div className="password-input-container">
//           <input
//             type={showPassword ? 'text' : 'password'} // Alterna entre texto y contraseña
//             placeholder="Confirmar Nueva Contraseña"
//             value={confirmPassword}
//             onChange={(e) => setConfirmPassword(e.target.value)}
//             required
//           />
//           <span className="password-toggle" onClick={togglePasswordVisibility}>
//             {showPassword ? <FaRegEyeSlash /> : <FaRegEye />}
//           </span>
//         </div>
//         <button type="submit" disabled={isSubmitting || !token}>
//           {isSubmitting ? 'Procesando...' : 'Restablecer Contraseña'}
//         </button>
//         <button type="button" onClick={() => navigate('/login')}>Volver</button>
//         {message && <p className={`message ${message.includes('exito') ? 'success' : ''}`}>{message}</p>}
//       </form>
//     </div>
//   );
// };

// export default ResetPassword;

import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios, { AxiosError } from 'axios';
import { LockClosedIcon, EyeIcon, EyeSlashIcon } from '@heroicons/react/24/outline';
import ApiRoutes from '../../Components/ApiRoutes';

interface ErrorResponse {
  message: string;
}

const ResetPassword = () => {
  const query = new URLSearchParams(useLocation().search);
  const token = query.get('token');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (!token) {
      setMessage('Token de restablecimiento no válido o faltante.');
    }
  }, [token]);

  const validatePassword = (password: string) => {
    const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/; // Al menos 8 caracteres, una letra y un número
    return passwordRegex.test(password);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      setMessage('Las contraseñas no coinciden');
      return;
    }

    if (!validatePassword(newPassword)) {
      setMessage('La contraseña debe tener al menos 8 caracteres, incluyendo una letra y un número.');
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await axios.post(`${ApiRoutes.usuarios}/reset-password`, {
        token,
        newPassword,
      });
      setMessage(response.data.message || 'Contraseña restablecida con éxito');
      setTimeout(() => navigate('/login'), 2000); // Redirige al login tras 2 segundos
    } catch (error) {
      const err = error as AxiosError<ErrorResponse>;
      setMessage(err.response?.data.message || 'Error al restablecer la contraseña');
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderInput = (
    name: string,
    label: string,
    value: string,
    setValue: (value: string) => void,
    showPasswordToggle: boolean,
    showPasswordState: boolean,
    toggleShowPassword: () => void
  ) => (
    <div>
      <label htmlFor={name} className="block text-sm font-medium text-gray-700 mb-2">
        {label}
      </label>
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <LockClosedIcon className="h-5 w-5 text-gray-400" aria-hidden="true" />
        </div>
        <input
          id={name}
          name={name}
          type={showPasswordToggle && showPasswordState ? 'text' : 'password'}
          className="appearance-none block w-full px-3 py-3 pl-10 border border-gray-300 rounded-lg placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
          placeholder={`Ingrese su ${label.toLowerCase()}`}
          value={value}
          onChange={(e) => setValue(e.target.value)}
        />
        {showPasswordToggle && (
          <button
            type="button"
            onClick={toggleShowPassword}
            className="absolute inset-y-0 right-0 pr-3 flex items-center focus:outline-none"
          >
            {showPasswordState ? (
              <EyeSlashIcon className="h-5 w-5 text-gray-400 hover:text-gray-500" aria-hidden="true" />
            ) : (
              <EyeIcon className="h-5 w-5 text-gray-400 hover:text-gray-500" aria-hidden="true" />
            )}
          </button>
        )}
      </div>
    </div>
  );

  return (
    <div className="min-h-screen w-full bg-gray-50">
      <div className="h-full w-full px-4 py-12 sm:px-6 lg:px-8">
        <div className="w-full max-w-2xl mx-auto">
          <div className="bg-white shadow-xl rounded-lg p-8">
            <h2 className="text-3xl font-extrabold text-gray-900 mb-8 text-center">
              Restablecer Contraseña
            </h2>
            <form onSubmit={handleSubmit} className="space-y-6">
              {renderInput(
                'newPassword',
                'Nueva Contraseña',
                newPassword,
                setNewPassword,
                true,
                showPassword,
                () => setShowPassword(!showPassword)
              )}
              {renderInput(
                'confirmPassword',
                'Confirmar Nueva Contraseña',
                confirmPassword,
                setConfirmPassword,
                true,
                showConfirmPassword,
                () => setShowConfirmPassword(!showConfirmPassword)
              )}

              {message && (
                <p
                  className={`text-center text-sm ${
                    message.toLowerCase().includes('éxito') || message.toLowerCase().includes('exito')
                      ? 'text-green-500'
                      : 'text-red-500'
                  }`}
                >
                  {message}
                </p>
              )}

              <div>
                <button
                  type="submit"
                  disabled={isSubmitting || !token}
                  className={`w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white ${
                    isSubmitting
                      ? 'bg-gray-400 cursor-not-allowed'
                      : 'bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500'
                  }`}
                >
                  {isSubmitting ? 'Procesando...' : 'Restablecer Contraseña'}
                </button>
                <button
                  type="button"
                  onClick={() => navigate('/login')}
                  className="w-full mt-2 flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-gray-700 bg-gray-300 hover:bg-gray-400 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
                >
                  Volver
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResetPassword;
