import React, { useState, useEffect } from 'react';
import { CalendarIcon, ClockIcon } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Cita } from '../Types';
import { jwtDecode } from 'jwt-decode';
import ApiRoutes from '../../Components/ApiRoutes';
import axios from 'axios';
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";
import { isWednesday } from 'date-fns';

interface DecodedToken {
  exp: number;
}

export default function UsuarioCita() {
  const [date, setDate] = useState<Date | null>(null);
  const [time, setTime] = useState('');
  const [description, setDescription] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [occupiedTimes, setOccupiedTimes] = useState<string[]>([]); // Estado para las horas ocupadas
  const navigate = useNavigate();

  const validTimes = [
    "08:00", "08:30", "09:00", "09:30", "10:00", "10:30", "11:00", "11:30",
    "13:00", "13:30", "14:00", "14:30", "15:00", "15:30",
  ];

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
    } else {
      try {
        const decodedToken: DecodedToken = jwtDecode(token);
        if (decodedToken.exp * 1000 < Date.now()) {
          localStorage.removeItem('token');
          navigate('/login');
        }
      } catch (e) {
        localStorage.removeItem('token');
        navigate('/login');
      }
    }
  }, [navigate]);

  // Consultar las horas ocupadas cuando se selecciona una fecha
  const handleDateChange = async (selectedDate: Date | null) => {
    setDate(selectedDate);
    setTime(''); // Limpiar la hora seleccionada cuando cambie la fecha
    setOccupiedTimes([]); // Limpiar horas ocupadas al cambiar la fecha

    if (selectedDate) {
      const formattedDate = `${selectedDate.getFullYear()}-${(selectedDate.getMonth() + 1).toString().padStart(2, '0')}-${selectedDate.getDate().toString().padStart(2, '0')}`;
      
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          navigate('/login');
          return;
        }
        
        // Llamada al endpoint para obtener las horas ocupadas
        const response = await axios.get(`${ApiRoutes.citas}/citas-ocupadas/${formattedDate}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (response.data && Array.isArray(response.data)) {
          setOccupiedTimes(response.data); // Actualiza el estado con las horas ocupadas
          console.log("Horas ocupadas para la fecha seleccionada:", response.data); // <-- Para depuración
        } else {
          console.error("El backend no devolvió un array. Respuesta recibida:", response.data);
        }
        
      } catch (error) {
        console.error('Error al obtener horas ocupadas:', error);
        setError('Error al cargar las horas disponibles.');
      }
    } else {
      setOccupiedTimes([]); // Limpia las horas ocupadas si no hay fecha seleccionada
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const formattedDate = date
      ? `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, '0')}-${date.getDate().toString().padStart(2, '0')}`
      : "";

    const newAppointment: Partial<Cita> = {
      date: formattedDate,
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
      const token = localStorage.getItem('token');
      if (!token) {
        navigate('/login');
        return;
      }

      const createdAppointment = await axios.post(ApiRoutes.citas.crearcita, newAppointment, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      console.log('Cita creada con éxito:', createdAppointment);

      setIsSubmitted(true);
      setError(null);

      setTimeout(() => {
        setDate(null);
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

  const filterWeekdays = (date: Date) => {
    return isWednesday(date);
  };

  return (
    // <div className="w-full">
    <div className="w-screen h-screen flex flex-col items-center justify-center bg-gray-100">
      <h2 className="text-3xl font-bold mb-6">Agendar Cita</h2>
      {/* <div className="bg-white shadow rounded-lg p-8 w-full"> */}
      <div className="bg-white shadow rounded-lg p-8 w-full max-w-lg">
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
                <DatePicker
                  selected={date}
                  onChange={handleDateChange}
                  filterDate={filterWeekdays} 
                  dateFormat="yyyy-MM-dd"
                  placeholderText="Selecciona una fecha"
                  minDate={new Date()}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                />
                <CalendarIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              </div>
            </div>

            {/* Renderizar el campo de selección de hora solo si se ha seleccionado una fecha */}
            {date && (
              <div>
                <label htmlFor="time" className="block text-sm font-medium text-gray-700 mb-1">
                  Hora
                </label>
                <div className="relative">
                  <select
                    id="time"
                    name="time"
                    value={time}
                    onChange={(e) => setTime(e.target.value)}
                    required
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="">Seleccione una hora</option>
                    {validTimes
                      .filter((timeOption) => !occupiedTimes.includes(timeOption)) // Filtrar horas ocupadas
                      .map((timeOption) => (
                        <option key={timeOption} value={timeOption}>
                          {timeOption}
                        </option>
                      ))}
                  </select>
                  <ClockIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                </div>
              </div>
            )}

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

// import React, { useState, useEffect } from 'react';
// import { CalendarIcon, ClockIcon } from 'lucide-react';
// import { useNavigate } from 'react-router-dom';
// import { Cita } from '../Types';
// import { jwtDecode } from 'jwt-decode';
// import ApiRoutes from '../../Components/ApiRoutes';
// import axios from 'axios';
// import DatePicker from 'react-datepicker';
// import "react-datepicker/dist/react-datepicker.css";
// import { isWednesday } from 'date-fns';

// interface DecodedToken {
//   exp: number;
// }

// export default function UsuarioCita() {
//   const [date, setDate] = useState<Date | null>(null);
//   const [time, setTime] = useState('');
//   const [description, setDescription] = useState('');
//   const [isSubmitted, setIsSubmitted] = useState(false);
//   const [error, setError] = useState<string | null>(null);
//   const [occupiedTimes, setOccupiedTimes] = useState<string[]>([]);
//   const navigate = useNavigate();

//   const validTimes = [
//     "08:00", "08:30", "09:00", "09:30", "10:00", "10:30", "11:00", "11:30",
//     "13:00", "13:30", "14:00", "14:30", "15:00", "15:30",
//   ];

//   useEffect(() => {
//     const token = localStorage.getItem('token');
//     if (!token) {
//       navigate('/login');
//     } else {
//       try {
//         const decodedToken: DecodedToken = jwtDecode(token);
//         if (decodedToken.exp * 1000 < Date.now()) {
//           localStorage.removeItem('token');
//           navigate('/login');
//         }
//       } catch (e) {
//         localStorage.removeItem('token');
//         navigate('/login');
//       }
//     }
//   }, [navigate]);

//   const handleDateChange = async (selectedDate: Date | null) => {
//     setDate(selectedDate);
//     setTime('');
//     setOccupiedTimes([]);

//     if (selectedDate) {
//       const formattedDate = `${selectedDate.getFullYear()}-${(selectedDate.getMonth() + 1).toString().padStart(2, '0')}-${selectedDate.getDate().toString().padStart(2, '0')}`;
//       try {
//         const token = localStorage.getItem('token');
//         if (!token) {
//           navigate('/login');
//           return;
//         }

//         const response = await axios.get(`${ApiRoutes.citas}/citas-ocupadas/${formattedDate}`, {
//           headers: {
//             Authorization: `Bearer ${token}`,
//           },
//         });

//         if (response.data && Array.isArray(response.data)) {
//           setOccupiedTimes(response.data);
//         } else {
//           console.error("El backend no devolvió un array. Respuesta recibida:", response.data);
//         }

//       } catch (error) {
//         console.error('Error al obtener horas ocupadas:', error);
//         setError('Error al cargar las horas disponibles.');
//       }
//     } else {
//       setOccupiedTimes([]);
//     }
//   };

//   const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
//     e.preventDefault();

//     const formattedDate = date
//       ? `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, '0')}-${date.getDate().toString().padStart(2, '0')}`
//       : "";

//     const newAppointment: Partial<Cita> = {
//       date: formattedDate,
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
//       const token = localStorage.getItem('token');
//       if (!token) {
//         navigate('/login');
//         return;
//       }

//       const createdAppointment = await axios.post(ApiRoutes.citas.crearcita, newAppointment, {
//         headers: {
//           Authorization: `Bearer ${token}`,
//         },
//       });

//       setIsSubmitted(true);
//       setError(null);

//       setTimeout(() => {
//         setDate(null);
//         setTime('');
//         setDescription('');
//         setIsSubmitted(false);
//       }, 3000);
//     } catch (error) {
//       console.error('Error al agendar la cita:', error);
//       setError('Error al agendar la cita. Intente de nuevo.');
//     }
//   };

//   const handleBack = () => {
//     navigate('/mis-citas');
//   };

//   const filterWeekdays = (date: Date) => {
//     return isWednesday(date);
//   };

//   return (
//     <div className="min-h-screen w-full flex items-center justify-center bg-gray-100 p-4">
//       <div className="bg-white shadow-md rounded-lg p-8 w-full max-w-3xl">
//         <h2 className="text-4xl font-bold mb-4 text-center">Agendar Cita</h2>
//         <p className="text-center mb-8 text-lg text-gray-700">
//           Selecciona una fecha y hora para agendar tu cita.
//         </p>
//         {isSubmitted ? (
//           <div className="text-green-600 font-semibold text-center">
//             ¡Cita agendada con éxito!
//           </div>
//         ) : (
//           <form onSubmit={handleSubmit} className="space-y-6">
//             {error && (
//               <div className="text-red-600 font-semibold text-center">
//                 {error}
//               </div>
//             )}

//             <div>
//               <label htmlFor="date" className="block text-sm font-medium text-gray-700 mb-1">
//                 Fecha
//               </label>
//               <div className="relative">
//                 <DatePicker
//                   selected={date}
//                   onChange={handleDateChange}
//                   filterDate={filterWeekdays}
//                   dateFormat="yyyy-MM-dd"
//                   placeholderText="Selecciona una fecha"
//                   minDate={new Date()}
//                   className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
//                 />
//                 <CalendarIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
//               </div>
//             </div>

//             {date && (
//               <div>
//                 <label htmlFor="time" className="block text-sm font-medium text-gray-700 mb-1">
//                   Hora
//                 </label>
//                 <div className="relative">
//                   <select
//                     id="time"
//                     name="time"
//                     value={time}
//                     onChange={(e) => setTime(e.target.value)}
//                     required
//                     className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
//                   >
//                     <option value="">Seleccione una hora</option>
//                     {validTimes
//                       .filter((timeOption) => !occupiedTimes.includes(timeOption))
//                       .map((timeOption) => (
//                         <option key={timeOption} value={timeOption}>
//                           {timeOption}
//                         </option>
//                       ))}
//                   </select>
//                   <ClockIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
//                 </div>
//               </div>
//             )}

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

//             <div className="flex space-x-4">
//               <button
//                 type="submit"
//                 className="flex-1 px-6 py-3 bg-blue-600 text-white font-medium rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
//               >
//                 Agendar Cita
//               </button>
//               <button
//                 onClick={handleBack}
//                 className="flex-1 px-6 py-3 bg-gray-300 text-gray-700 font-semibold rounded hover:bg-gray-400 transition-colors"
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
