// import React, { useState, useEffect } from 'react';
// import { CalendarIcon, ClockIcon } from 'lucide-react';
// import { useNavigate } from 'react-router-dom';
// import ApiService from '../../Components/ApiService';
// import { Cita } from '../Types';
// import {jwtDecode} from 'jwt-decode';
// import ApiRoutes from '../../Components/ApiRoutes';

// interface DecodedToken {
//   exp: number; 
// }

// export default function UsuarioCita() {
//   const [date, setDate] = useState('');
//   const [time, setTime] = useState('');
//   const [description, setDescription] = useState('');
//   const [isSubmitted, setIsSubmitted] = useState(false);
//   const [error, setError] = useState<string | null>(null);
//   const navigate = useNavigate();

//   // Comprobación de autenticación y expiración del token
//   useEffect(() => {
//     const token = localStorage.getItem('token');
//     if (!token) {
//       navigate('/login'); // Redirige al login si no hay token
//     } else {
//       try {
//         const decodedToken: DecodedToken = jwtDecode(token);
        
//         // Verificar si el token ha expirado
//         if (decodedToken.exp * 1000 < Date.now()) {
//           console.warn('Token expirado, redirigiendo al login');
//           localStorage.removeItem('token'); // Eliminar token expirado
//           navigate('/login');
//         }
//       } catch (e) {
//         console.error('Token inválido, redirigiendo al login');
//         localStorage.removeItem('token'); // Elimina token inválido
//         navigate('/login');
//       }
//     }
//   }, [navigate]);

//   const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
//     e.preventDefault();

//     const newAppointment: Partial<Cita> = {
//       date,
//       time,
//       description,
//       status: 'Pendiente',
//       user: {
//         id: 1,
//         nombre: '',
//         cedula: '',
//         email: '',
//       },
//     };

//     try {
//       const createdAppointment = await ApiService.post<Cita>(ApiRoutes.citas.crearcita, newAppointment);
//       console.log('Cita creada con éxito:', createdAppointment);

//       setIsSubmitted(true);
//       setError(null);

//       setTimeout(() => {
//         setDate('');
//         setTime('');
//         setDescription('');
//         setIsSubmitted(false);
//       }, 3000);
//     } catch (error) {
//       setError('Error al agendar la cita. Intente de nuevo.');
//     }
//   };

//   const handleBack = () => {
//     navigate('/mis-citas');
//   };

//   return (
//     <div className="w-full">
//       <h2 className="text-3xl font-bold mb-6">Agendar Cita</h2>
//       <div className="bg-white shadow rounded-lg p-8 w-full">
//         {isSubmitted ? (
//           <div className="text-green-600 font-semibold text-center">
//             ¡Cita agendada con éxito!
//           </div>
//         ) : (
//           <form onSubmit={handleSubmit} className="space-y-6">
//             {error && <div className="text-red-600 font-semibold text-center">{error}</div>}

//             <div>
//               <label htmlFor="date" className="block text-sm font-medium text-gray-700 mb-1">
//                 Fecha
//               </label>
//               <div className="relative">
//                 <input
//                   type="date"
//                   id="date"
//                   name="date"
//                   value={date}
//                   onChange={(e) => setDate(e.target.value)}
//                   required
//                   className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
//                 />
//                 <CalendarIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
//               </div>
//             </div>

//             <div>
//               <label htmlFor="time" className="block text-sm font-medium text-gray-700 mb-1">
//                 Hora
//               </label>
//               <div className="relative">
//                 <input
//                   type="time"
//                   id="time"
//                   name="time"
//                   value={time}
//                   onChange={(e) => setTime(e.target.value)}
//                   required
//                   className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
//                 />
//                 <ClockIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
//               </div>
//             </div>

//             <div>
//               <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
//                 Motivo de la Cita
//               </label>
//               <textarea
//                 id="description"
//                 name="description"
//                 value={description}
//                 onChange={(e) => setDescription(e.target.value)}
//                 required
//                 rows={4}
//                 className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
//                 placeholder="Ingrese los detalles del motivo de la cita"
//               ></textarea>
//             </div>

//             <div>
//               <button
//                 type="submit"
//                 className="w-full px-6 py-3 bg-blue-600 text-white font-medium rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
//               >
//                 Agendar Cita
//               </button>
//               <button
//                 onClick={handleBack}
//                 className="w-full mt-4 px-6 py-3 bg-gray-300 text-gray-700 font-semibold rounded hover:bg-gray-400 transition-colors"
//               >
//                 Volver
//               </button>
//             </div>
//           </form>
//         )}
//       </div>
//     </div>
//   );
// }


import React, { useState, useEffect } from 'react';
import { CalendarIcon, ClockIcon } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
// import ApiService from '../../Components/ApiService';
import { Cita } from '../Types';
import {jwtDecode} from 'jwt-decode';
import ApiRoutes from '../../Components/ApiRoutes';
import axios from 'axios';

interface DecodedToken {
  exp: number; 
}

export default function UsuarioCita() {
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [description, setDescription] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  // Comprobación de autenticación y expiración del token
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      // Si no hay token, redirige al login
      navigate('/login');
    } else {
      try {
        const decodedToken: DecodedToken = jwtDecode(token);

        // Verificar si el token ha expirado
        if (decodedToken.exp * 1000 < Date.now()) {
          console.warn('Token expirado, redirigiendo al login');
          localStorage.removeItem('token'); // Eliminar token expirado
          navigate('/login');
        }
      } catch (e) {
        console.error('Token inválido, redirigiendo al login');
        localStorage.removeItem('token'); // Elimina token inválido
        navigate('/login');
      }
    }
  }, [navigate]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
  
    const newAppointment: Partial<Cita> = {
      date,
      time,
      description,
      status: 'Pendiente',
      user: {
        id: 1,
        nombre: '',
        cedula: '',
        email: '',
      },
    };
  
    try {
      // Asegurarse de que el token está disponible antes de enviar la solicitud
      const token = localStorage.getItem('token');
      if (!token) {
        navigate('/login');
        return;
      }
  
      // Configurar la solicitud con Axios directamente
      const createdAppointment = await axios.post(ApiRoutes.citas.crearcita, newAppointment, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      
      console.log('Cita creada con éxito:', createdAppointment);
  
      setIsSubmitted(true);
      setError(null);
  
      // Limpiar el formulario después de unos segundos
      setTimeout(() => {
        setDate('');
        setTime('');
        setDescription('');
        setIsSubmitted(false);
      }, 3000);
    } catch (error) {
      console.error('Error al agendar la cita:', error);
      setError('Error al agendar la cita. Intente de nuevo.');
    }
  };
  const handleBack = () => {
    navigate('/mis-citas');
  };

  return (
    <div className="w-full">
      <h2 className="text-3xl font-bold mb-6">Agendar Cita</h2>
      <div className="bg-white shadow rounded-lg p-8 w-full">
        {isSubmitted ? (
          <div className="text-green-600 font-semibold text-center">
            ¡Cita agendada con éxito!
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6">
            {error && <div className="text-red-600 font-semibold text-center">{error}</div>}

            <div>
              <label htmlFor="date" className="block text-sm font-medium text-gray-700 mb-1">
                Fecha
              </label>
              <div className="relative">
                <input
                  type="date"
                  id="date"
                  name="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  required
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                />
                <CalendarIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              </div>
            </div>

            <div>
              <label htmlFor="time" className="block text-sm font-medium text-gray-700 mb-1">
                Hora
              </label>
              <div className="relative">
                <input
                  type="time"
                  id="time"
                  name="time"
                  value={time}
                  onChange={(e) => setTime(e.target.value)}
                  required
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                />
                <ClockIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              </div>
            </div>

            <div>
              <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
                Motivo de la Cita
              </label>
              <textarea
                id="description"
                name="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                required
                rows={4}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                placeholder="Ingrese los detalles del motivo de la cita"
              ></textarea>
            </div>

            <div>
              <button
                type="submit"
                className="w-full px-6 py-3 bg-blue-600 text-white font-medium rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Agendar Cita
              </button>
              <button
                onClick={handleBack}
                className="w-full mt-4 px-6 py-3 bg-gray-300 text-gray-700 font-semibold rounded hover:bg-gray-400 transition-colors"
              >
                Volver
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
