import React, { useState, useEffect } from 'react';
import { CalendarIcon, ClockIcon } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';
import ApiRoutes from '../../Components/ApiRoutes';
import axios from 'axios';
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";

interface DecodedToken {
  exp: number;
}

interface AvailableDate {
  id: number;
  date: string;
  horasCita: {
    id: number;
    hora: string;
    disponibilidad: boolean;
  }[];
}

export default function UsuarioCita() {
  const [date, setDate] = useState<Date | null>(null);
  const [time, setTime] = useState('');
  const [description, setDescription] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [availableDates, setAvailableDates] = useState<AvailableDate[]>([]); // Estado para las fechas y horas disponibles
  const [availableHours, setAvailableHours] = useState<string[]>([]); // Estado para las horas disponibles de la fecha seleccionada
  const navigate = useNavigate();

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

  // Obtener las fechas con horas disponibles
  useEffect(() => {
    const fetchAvailableDates = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          navigate('/login');
          return;
        }

        const response = await axios.get(ApiRoutes.fechaDisponible, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (response.data && Array.isArray(response.data)) {
          setAvailableDates(response.data);
        } else {
          console.error("El backend no devolvió un array. Respuesta recibida:", response.data);
        }
      } catch (error) {
        console.error('Error al obtener fechas disponibles:', error);
        setError('Error al cargar las fechas disponibles.');
      }
    };

    fetchAvailableDates();
  }, [navigate]);

  // Manejar el cambio de fecha seleccionada
  const handleDateChange = async (selectedDate: Date | null) => {
    setDate(selectedDate);
    setTime(''); // Limpiar la hora seleccionada al cambiar la fecha

    if (selectedDate) {
      const formattedDate = selectedDate.toISOString().split('T')[0]; // Formatear la fecha como 'YYYY-MM-DD'

      // Buscar la fecha seleccionada en las fechas disponibles
      const selectedDateData = availableDates.find(
        (availableDate) => availableDate.date === formattedDate
      );

      if (selectedDateData) {
        // Filtrar las horas disponibles (disponibilidad: true)
        const horasDisponibles = selectedDateData.horasCita
          .filter((hora) => hora.disponibilidad)
          .map((hora) => hora.hora);

        setAvailableHours(horasDisponibles); // Actualizar las horas disponibles
      } else {
        setAvailableHours([]); // No hay horas disponibles para esta fecha
      }
    } else {
      setAvailableHours([]); // Limpiar las horas disponibles si no hay fecha seleccionada
    }
  };

  // const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
  //   e.preventDefault();
  
  //   if (!date || !time) {
  //     setError('Por favor, selecciona una fecha y una hora.');
  //     return;
  //   }
  
  //   const formattedDate = date.toISOString().split('T')[0]; // Formatear la fecha como 'YYYY-MM-DD'
  
  //   // Buscar la fecha seleccionada en las fechas disponibles
  //   const selectedDateData = availableDates.find(
  //     (availableDate) => availableDate.date === formattedDate
  //   );
  
  //   if (!selectedDateData) {
  //     setError('Fecha no válida.');
  //     return;
  //   }
  
  //   // Buscar la hora seleccionada en las horas disponibles
  //   const selectedHourData = selectedDateData.horasCita.find(
  //     (hora) => hora.hora === time
  //   );
  
  //   if (!selectedHourData) {
  //     setError('Hora no válida.');
  //     return;
  //   }
  
  //   // Obtener el token
  //   const token = localStorage.getItem('token');
  //   if (!token) {
  //     navigate('/login');
  //     return;
  //   }
  
  //   // Crear el cuerpo de la solicitud según lo que espera el backend
  //   const newAppointment = {
  //     description,
  //     availableDateId: selectedDateData.id, // ID de la fecha disponible
  //     horasCitaId: selectedHourData.id, // ID de la hora seleccionada
  //   };
  
  //   // Verificar los datos que se enviarán en la solicitud
  //   console.log('Datos que se enviarán en la solicitud POST:', newAppointment);
  
  //   try {
  //     const response = await axios.post(ApiRoutes.citas.crearcita, newAppointment, {
  //       headers: {
  //         Authorization: `Bearer ${token}`,
  //       },
  //     });
  
  //     console.log('Cita creada con éxito:', response.data);
  
  //     setIsSubmitted(true);
  //     setError(null);
  
  //     setTimeout(() => {
  //       setDate(null);
  //       setTime('');
  //       setDescription('');
  //       setIsSubmitted(false);
  //       navigate('/mis-citas');
  //     }, 3000);
  //   } catch (error) {
  //     console.error('Error al agendar la cita:', error);
  //     setError('Error al agendar la cita. Intente de nuevo.');
  //   }
  // };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
  
    if (!date || !time) {
      setError('Por favor, selecciona una fecha y una hora.');
      window.alert('Por favor, selecciona una fecha y una hora.');
      return;
    }
  
    const formattedDate = date.toISOString().split('T')[0]; // Formato 'YYYY-MM-DD'
  
    // Buscar si el usuario ya tiene una cita en esta fecha
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
      return;
    }
  
    try {
      // Obtener citas existentes del usuario
      const userAppointments = await axios.get(ApiRoutes.citas.miscitas, {
        headers: { Authorization: `Bearer ${token}` },
      });
  
      const hasExistingAppointment = userAppointments.data.some(
        (appointment: any) => appointment.availableDate.date === formattedDate
      );
  
      if (hasExistingAppointment) {
        const errorMessage = 'Ya tienes una cita programada para esta fecha.';
        setError(errorMessage);
        window.alert(errorMessage);
        return;
      }
  
      // Si no hay cita en esa fecha, proceder con la creación
      const selectedDateData = availableDates.find(
        (availableDate) => availableDate.date === formattedDate
      );
  
      if (!selectedDateData) {
        setError('Fecha no válida.');
        window.alert('Fecha no válida.');
        return;
      }
  
      const selectedHourData = selectedDateData.horasCita.find(
        (hora) => hora.hora === time
      );
  
      if (!selectedHourData) {
        setError('Hora no válida.');
        window.alert('Hora no válida.');
        return;
      }
  
      const newAppointment = {
        description,
        availableDateId: selectedDateData.id,
        horasCitaId: selectedHourData.id,
      };
  
      const response = await axios.post(ApiRoutes.citas.crearcita, newAppointment, {
        headers: { Authorization: `Bearer ${token}` },
      });
  
      console.log('✅ Cita creada con éxito:', response.data);
  
      window.alert('✅ ¡Cita agendada con éxito!');
      setIsSubmitted(true);
      setError(null);
  
      setTimeout(() => {
        setDate(null);
        setTime('');
        setDescription('');
        setIsSubmitted(false);
        navigate('/mis-citas');
      }, 3000);
    } catch (error) {
      console.error('Error al agendar la cita:', error);
      const errorMessage = '❌ Error al agendar la cita. Intente de nuevo.';
      setError(errorMessage);
      window.alert(errorMessage);
    }
  };
  


  const handleBack = () => {
    navigate('/mis-citas');
  };

  // Filtrar fechas disponibles
  const filterAvailableDates = (date: Date) => {
    const formattedDate = date.toISOString().split('T')[0];
    return availableDates.some((availableDate) => availableDate.date === formattedDate);
  };

  return (
    <div className="w-screen h-screen flex flex-col items-center justify-center bg-gray-100">
      <h2 className="text-3xl font-bold mb-6">Agendar Cita</h2>
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
                  filterDate={filterAvailableDates} // Filtra las fechas disponibles
                  dateFormat="yyyy-MM-dd"
                  placeholderText="Selecciona una fecha"
                  minDate={new Date()}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                />
                <CalendarIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              </div>
            </div>

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
                    {availableHours.length === 0 ? (
                      <option value="" disabled>No hay horas disponibles</option>
                    ) : (
                      availableHours.map((hora) => (
                        <option key={hora} value={hora}>
                          {hora}
                        </option>
                      ))
                    )}
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
