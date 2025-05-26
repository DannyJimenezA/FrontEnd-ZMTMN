import React, { useState, useEffect } from 'react';
import { CalendarIcon, ClockIcon } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';
import ApiRoutes from '../../Components/ApiRoutes';
import axios from 'axios';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';

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

const formatTo12Hour = (time24: string): string => {
  if (!time24) return 'Hora inválida';
  const parts = time24.split(':');
  if (parts.length < 2) return time24;

  const hour = parseInt(parts[0], 10);
  const minute = parts[1]?.padStart(2, '0') || '00';
  const ampm = hour >= 12 ? 'PM' : 'AM';
  const formattedHour = hour % 12 || 12;

  return `${formattedHour}:${minute} ${ampm}`;
};


export default function UsuarioCita() {
  const [date, setDate] = useState<Date | null>(null);
  const [time, setTime] = useState('');
  const [description, setDescription] = useState('');
  const [availableDates, setAvailableDates] = useState<AvailableDate[]>([]);
  const [availableHours, setAvailableHours] = useState<string[]>([]);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  const MySwal = withReactContent(Swal);

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
      } catch {
        localStorage.removeItem('token');
        navigate('/login');
      }
    }
  }, [navigate]);

  useEffect(() => {
    const fetchAvailableDates = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) return;

        const response = await axios.get(ApiRoutes.fechaDisponible, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (Array.isArray(response.data)) {
          setAvailableDates(response.data);
        }
      } catch (err) {
        console.error('Error al obtener fechas disponibles:', err);
        setError('Error al cargar las fechas disponibles.');
      }
    };

    fetchAvailableDates();
  }, []);

  const handleDateChange = (selectedDate: Date | null) => {
    setDate(selectedDate);
    setTime('');
    if (!selectedDate) return setAvailableHours([]);

    const formattedDate = selectedDate.toISOString().split('T')[0];
    const selected = availableDates.find(d => d.date === formattedDate);

    if (selected) {
      const horas = selected.horasCita
        .filter(h => h.disponibilidad)
        .map(h => h.hora);
      setAvailableHours(horas);
    } else {
      setAvailableHours([]);
    }
  };

  // const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
  //   e.preventDefault();

  //   const camposFaltantes: string[] = [];
  //   if (!date) camposFaltantes.push('Fecha');
  //   if (!time) camposFaltantes.push('Hora');
  //   if (!description.trim()) camposFaltantes.push('Motivo de la cita');

  //   if (camposFaltantes.length > 0) {
  //     await MySwal.fire({
  //       icon: 'warning',
  //       title: 'Campos requeridos faltantes',
  //       html: `<ul style="text-align: left;">${camposFaltantes.map(c => `<li>• ${c}</li>`).join('')}</ul>`,
  //       confirmButtonText: 'Entendido',
  //     });
  //     return;
  //   }

  //   const confirmacion = await MySwal.fire({
  //     title: '¿Está seguro de agendar una cita?',
  //     icon: 'question',
  //     showCancelButton: true,
  //     confirmButtonText: 'Aceptar',
  //     cancelButtonText: 'Cancelar',
  //     customClass: {
  //       confirmButton: 'btn-azul',
  //       cancelButton: 'btn-rojo',
  //       actions: 'botones-horizontales',
  //     },
  //     buttonsStyling: false,
  //   });

  //   if (!confirmacion.isConfirmed) {
  //     return;
  //   }

  //   const token = localStorage.getItem('token');
  //   if (!token) {
  //     navigate('/login');
  //     return;
  //   }

  //   const formattedDate = date!.toISOString().split('T')[0];

  //   try {
  //     const userAppointments = await axios.get(ApiRoutes.citas.miscitas, {
  //       headers: { Authorization: `Bearer ${token}` },
  //     });

  //     // const yaTieneCita = userAppointments.data.some(
  //     //   (cita: any) => cita.availableDate.date === formattedDate
  //     // );
  //     const yaTieneCita = userAppointments.data.some(
  //       (cita: any) =>
  //         cita.availableDate.date === formattedDate &&
  //         ['Pendiente', 'Aprobada'].includes(cita.status)
  //     );


  //     if (yaTieneCita) {
  //       await MySwal.fire({
  //         icon: 'warning',
  //         title: 'Ya tienes una cita programada para esta fecha.',
  //         confirmButtonText: 'Aceptar',
  //       });
  //       return;
  //     }

  //     const fechaSeleccionada = availableDates.find(d => d.date === formattedDate);
  //     const horaSeleccionada = fechaSeleccionada?.horasCita.find(h => h.hora === time);

  //     if (!fechaSeleccionada || !horaSeleccionada) {
  //       await MySwal.fire('Error', 'Fecha u hora no válida.', 'error');
  //       return;
  //     }

  //     const nuevaCita = {
  //       description,
  //       availableDateId: fechaSeleccionada.id,
  //       horasCitaId: horaSeleccionada.id,
  //     };

  //     await axios.post(ApiRoutes.citas.crearcita, nuevaCita, {
  //       headers: { Authorization: `Bearer ${token}` },
  //     });

  //     await MySwal.fire({
  //       icon: 'success',
  //       title: '¡Cita agendada con éxito!',
  //       text: 'La cita fue agendada correctamente.',
  //       timer: 2000,
  //       showConfirmButton: false,
  //     });

  //     setDate(null);
  //     setTime('');
  //     setDescription('');
  //     navigate('/mis-citas');


  //   } catch (err: any) {
  //     console.error('Error al agendar la cita:', err);

  //     let mensajeFinal = 'Ocurrió un problema al agendar la cita. Intenta nuevamente.';

  //     // Revisa si hay respuesta del backend
  //     const data = err?.response?.data;

  //     if (data) {
  //       if (typeof data.message === 'string') {
  //         mensajeFinal = data.message;
  //       } else if (Array.isArray(data.message)) {
  //         mensajeFinal = data.message.join('\n');
  //       } else if (typeof data === 'string') {
  //         mensajeFinal = data;
  //       } else if (data.error) {
  //         mensajeFinal = data.error;
  //       }
  //     } else if (err.message) {
  //       mensajeFinal = err.message; // fallback para errores de red
  //     }

  //     console.log('Respuesta del backend:', err?.response?.data);

  //     await MySwal.fire({
  //       icon: 'error',
  //       title: 'Error al agendar la cita',
  //       text: mensajeFinal,
  //       confirmButtonColor: '#dc2626',
  //     });
  //   }


  // };

  // const filterAvailableDates = (date: Date) => {
  //   const formatted = date.toISOString().split('T')[0];
  //   return availableDates.some(d => d.date === formatted);
  // };
  //   const filterAvailableDates = (date: Date) => {
  //   const formatted = date.toISOString().split('T')[0];

  //   const available = availableDates.some(d => d.date === formatted);
  //   if (!available) return false;

  //   const now = new Date();

  //   const appointmentDate = new Date(date);
  //   appointmentDate.setHours(0, 0, 0, 0);

  //   const dayBefore = new Date(appointmentDate);
  //   dayBefore.setDate(dayBefore.getDate() - 1);
  //   dayBefore.setHours(12, 0, 0, 0); // día anterior a las 12:00 PM

  //   // Si ya pasó el corte → bloquear esta fecha
  //   return now < dayBefore;
  // };
  
  
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
  e.preventDefault();

  const camposFaltantes: string[] = [];
  if (!date) camposFaltantes.push('Fecha');
  if (!time) camposFaltantes.push('Hora');
  if (!description.trim()) camposFaltantes.push('Motivo de la cita');

  if (camposFaltantes.length > 0) {
    await MySwal.fire({
      icon: 'warning',
      title: 'Campos requeridos faltantes',
      html: `<ul style="text-align: left;">${camposFaltantes.map(c => `<li>• ${c}</li>`).join('')}</ul>`,
      confirmButtonText: 'Entendido',
    });
    return;
  }

  // ❗ Validación de palabras largas
  const palabrasLargas = description.split(/\s+/).filter(p => p.length > 30);
  if (palabrasLargas.length > 0) {
    await MySwal.fire({
      icon: 'warning',
      title: 'Motivo inválido',
      text: 'Por favor evita usar palabras con más de 30 caracteres seguidos.',
      confirmButtonText: 'Entendido',
    });
    return;
  }

  const confirmacion = await MySwal.fire({
    title: '¿Está seguro de agendar una cita?',
    icon: 'question',
    showCancelButton: true,
    confirmButtonText: 'Aceptar',
    cancelButtonText: 'Cancelar',
    customClass: {
      confirmButton: 'btn-azul',
      cancelButton: 'btn-rojo',
      actions: 'botones-horizontales',
    },
    buttonsStyling: false,
  });

  if (!confirmacion.isConfirmed) return;

  const token = localStorage.getItem('token');
  if (!token) {
    navigate('/login');
    return;
  }

  const formattedDate = date!.toISOString().split('T')[0];

  try {
    const userAppointments = await axios.get(ApiRoutes.citas.miscitas, {
      headers: { Authorization: `Bearer ${token}` },
    });

    const yaTieneCita = userAppointments.data.some(
      (cita: any) =>
        cita.availableDate.date === formattedDate &&
        ['Pendiente', 'Aprobada'].includes(cita.status)
    );

    if (yaTieneCita) {
      await MySwal.fire({
        icon: 'warning',
        title: 'Ya tienes una cita programada para esta fecha.',
        confirmButtonText: 'Aceptar',
      });
      return;
    }

    const fechaSeleccionada = availableDates.find(d => d.date === formattedDate);
    const horaSeleccionada = fechaSeleccionada?.horasCita.find(h => h.hora === time);

    if (!fechaSeleccionada || !horaSeleccionada) {
      await MySwal.fire('Error', 'Fecha u hora no válida.', 'error');
      return;
    }

    const nuevaCita = {
      description,
      availableDateId: fechaSeleccionada.id,
      horasCitaId: horaSeleccionada.id,
    };

    await axios.post(ApiRoutes.citas.crearcita, nuevaCita, {
      headers: { Authorization: `Bearer ${token}` },
    });

    await MySwal.fire({
      icon: 'success',
      title: '¡Cita agendada con éxito!',
      text: 'La cita fue agendada correctamente.',
      timer: 2000,
      showConfirmButton: false,
    });

    setDate(null);
    setTime('');
    setDescription('');
    navigate('/mis-citas');

  } catch (err: any) {
    console.error('Error al agendar la cita:', err);

    let mensajeFinal = 'Ocurrió un problema al agendar la cita. Intenta nuevamente.';

    const data = err?.response?.data;
    if (data) {
      if (typeof data.message === 'string') mensajeFinal = data.message;
      else if (Array.isArray(data.message)) mensajeFinal = data.message.join('\n');
      else if (typeof data === 'string') mensajeFinal = data;
      else if (data.error) mensajeFinal = data.error;
    } else if (err.message) {
      mensajeFinal = err.message;
    }

    await MySwal.fire({
      icon: 'error',
      title: 'Error al agendar la cita',
      text: mensajeFinal,
      confirmButtonColor: '#dc2626',
    });
  }
};

  
  const filterAvailableDates = (date: Date) => {
    const formatted = date.toISOString().split('T')[0];

    // Buscar si la fecha existe en la lista de disponibles
    const fecha = availableDates.find(d => d.date === formatted);

    if (!fecha) return false;

    // Validar si tiene al menos una hora con disponibilidad
    const tieneHorasDisponibles = fecha.horasCita.some(h => h.disponibilidad);
    if (!tieneHorasDisponibles) return false;

    // Validar el corte de día anterior a las 12:00 PM
    const now = new Date();
    const appointmentDate = new Date(date);
    appointmentDate.setHours(0, 0, 0, 0);

    const dayBefore = new Date(appointmentDate);
    dayBefore.setDate(dayBefore.getDate() - 1);
    dayBefore.setHours(12, 0, 0, 0);

    return now < dayBefore;
  };



  return (
    <div className="w-screen h-screen flex flex-col items-center justify-center bg-gray-100">
      <style>
        {`
          .btn-azul {
            background-color: #2563eb !important;
            color: white !important;
            border: none !important;
            border-radius: 6px !important;
            padding: 8px 20px !important;
            font-weight: bold !important;
          }

         .btn-rojo {
      background-color: #dc2626 !important;
      color: white !important;
      border: none !important;
      border-radius: 6px !important;
      padding: 8px 20px !important;
      font-weight: bold !important;
    }

          .botones-horizontales {
            display: flex !important;
            justify-content: center;
            gap: 10px;
          }
        `}
      </style>

      <h2 className="text-3xl font-bold mb-6">Agendar Cita</h2>
      <div className="bg-white shadow rounded-lg p-8 w-full max-w-lg">
        <form onSubmit={handleSubmit} className="space-y-6">
          {error && <div className="text-red-600 text-center">{error}</div>}

          <div>
            <label htmlFor="date" className="block text-sm font-medium text-gray-700 mb-1">Fecha</label>
            <div className="relative">
              <DatePicker
                selected={date}
                onChange={handleDateChange}
                filterDate={filterAvailableDates}
                // dateFormat="yyyy-MM-dd"
                dateFormat="dd/MM/yyyy"
                placeholderText="Selecciona una fecha"
                minDate={new Date()}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              />
              <CalendarIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            </div>
          </div>

          {date && (
            <div>
              <label htmlFor="time" className="block text-sm font-medium text-gray-700 mb-1">Hora</label>
              <div className="relative">
                <select
                  id="time"
                  name="time"
                  value={time}
                  onChange={(e) => setTime(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="">Seleccione una hora</option>
                  {availableHours.length === 0 ? (
                    <option disabled>No hay horas disponibles</option>
                  ) : (
                    availableHours.map(h => (
                      <option key={h} value={h}>{formatTo12Hour(h)}</option>

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
              maxLength={250}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={4}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              placeholder="Ingrese el motivo de la cita"
            ></textarea>
          </div>

          <div>
            <button
              type="submit"
              className="w-full px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700"
            >
              Agendar Cita
            </button>

            <button
              type="button"
              onClick={() => navigate('/mis-citas')}
              className="w-full mt-4 px-6 py-3 bg-gray-300 text-gray-700 rounded hover:bg-gray-400"
            >
              Volver
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
