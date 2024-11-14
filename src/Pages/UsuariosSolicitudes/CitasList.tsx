import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";
import { isWednesday } from 'date-fns';
import Navbar from '../../Components/Navbar';
import { CalendarIcon, PencilIcon, TrashIcon, XCircleIcon, CheckCircleIcon } from 'lucide-react';
import ApiRoutes from '../../Components/ApiRoutes';

interface Appointment {
  id: number;
  description: string;
  date: string;
  time: string;
  status?: string;
}

const CitasList = () => {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [editingAppointmentId, setEditingAppointmentId] = useState<number | null>(null);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedTime, setSelectedTime] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  const token = localStorage.getItem('token');

  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        setIsLoading(true);
        const response = await axios.get(ApiRoutes.citas.miscitas, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setAppointments(response.data);
      } catch (error) {
        setError('Error al cargar las citas. Por favor, intente nuevamente.');
        console.error('Error fetching appointments:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchAppointments();
  }, [token]);

  const handleCreateAppointment = () => {
    navigate('/usuario-cita');
  };

  const handleEditClick = (appointment: Appointment) => {
    setEditingAppointmentId(appointment.id);
    setSelectedDate(new Date(appointment.date));
    setSelectedTime(appointment.time);
    setDescription(appointment.description);
  };

  const handleSaveClick = async (appointmentId: number) => {
    const validTimes = [
      "08:00", "08:30", "09:00", "09:30", "10:00", "10:30", "11:00", "11:30",
      "13:00", "13:30", "14:00", "14:30", "15:00", "15:30",
    ];
    
    if (!validTimes.includes(selectedTime)) {
      setError("La hora seleccionada no es válida.");
      return;
    }

    try {
      const updatedAppointment: Partial<Appointment> = {
        description,
        date: selectedDate ? selectedDate.toISOString().split('T')[0] : "",
        time: selectedTime,
      };

      const response = await axios.put(
        `${ApiRoutes.citas.crearcita}/${appointmentId}`,
        updatedAppointment,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (response.status >= 200 && response.status < 300) {
        setAppointments((prev) =>
          prev.map((appointment) =>
            appointment.id === appointmentId ? { ...appointment, ...updatedAppointment } : appointment
          )
        );
        setEditingAppointmentId(null);
        setError(null);
      }
    } catch (error) {
      setError("Hubo un error al actualizar la cita.");
      console.error("Error al actualizar la cita:", error);
    }
  };

  const handleDeleteAppointment = async (id: number) => {
    if (!window.confirm('¿Está seguro que desea eliminar esta cita?')) {
      return;
    }

    try {
      await axios.delete(`${ApiRoutes.citas.crearcita}/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setAppointments((prev) => prev.filter((appointment) => appointment.id !== id));
    } catch (error) {
      setError('Error al eliminar la cita. Por favor, intente nuevamente.');
      console.error('Error deleting appointment:', error);
    }
  };

  const handleCancelClick = () => {
    setEditingAppointmentId(null);
    setSelectedDate(null);
    setSelectedTime("");
    setDescription("");
    setError(null);
  };

  const filterWeekdays = (date: Date) => {
    return date && isWednesday(date);
  };

  const getTimeOptions = () => {
    const times = [
      "08:00", "08:30", "09:00", "09:30", "10:00", "10:30", "11:00", "11:30",
      "13:00", "13:30", "14:00", "14:30", "15:00", "15:30",
    ];
    return times;
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Mis Citas</h1>
          <button 
            onClick={handleCreateAppointment}
            className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
          >
            <CalendarIcon className="h-4 w-4 mr-2" />
            Crear Cita
          </button>
        </div>

        {error && (
          <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-6">
            <p className="text-red-700">{error}</p>
          </div>
        )}

        <div className="grid gap-6">
          {appointments.length === 0 ? (
            <div className="bg-white rounded-lg shadow p-6 text-center">
              <p className="text-gray-500">No se encontraron citas programadas</p>
            </div>
          ) : (
            appointments.map((appointment) => (
              <div key={appointment.id} className="bg-white rounded-lg shadow">
                {editingAppointmentId === appointment.id ? (
                  <div className="p-6">
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium mb-1">Descripción de la cita</label>
                        <textarea
                          value={description}
                          onChange={(e) => setDescription(e.target.value)}
                          className="w-full min-h-[100px] rounded-md border border-gray-300 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-1">Fecha</label>
                        <div className="relative">
                          <DatePicker
                            selected={selectedDate}
                            onChange={(date) => setSelectedDate(date)}
                            filterDate={filterWeekdays}
                            dateFormat="yyyy-MM-dd"
                            placeholderText="Selecciona una fecha"
                            minDate={new Date()}
                            className="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                          />
                        </div>
                      </div>
                      {selectedDate && (
                        <div>
                          <label className="block text-sm font-medium mb-1">Hora</label>
                          <select
                            value={selectedTime}
                            onChange={(e) => setSelectedTime(e.target.value)}
                            className="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                          >
                            <option value="">Seleccione una hora</option>
                            {getTimeOptions().map((time) => (
                              <option key={time} value={time}>{time}</option>
                            ))}
                          </select>
                        </div>
                      )}
                      <div className="flex justify-end gap-2 mt-4">
                        <button
                          onClick={handleCancelClick}
                          className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
                        >
                          Cancelar
                        </button>
                        <button
                          onClick={() => handleSaveClick(appointment.id)}
                          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                        >
                          Guardar
                        </button>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="p-6">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="text-lg font-semibold mb-2">{appointment.description}</h3>
                        <div className="space-y-1 text-sm text-gray-500">
                          <p>Fecha: {new Date(appointment.date).toLocaleDateString()}</p>
                          <p>Hora: {appointment.time}</p>
                          <p className="flex items-center gap-1">
                            Estado: 
                            <span className={`inline-flex items-center ${
                              appointment.status === 'Aprobada' ? 'text-green-600' 
                              : appointment.status === 'Denegada'? 'text-red-600'
                              : 'text-yellow-600'
                            }`}>
                              {appointment.status === 'confirmed' ? (
                                <CheckCircleIcon className="h-4 w-4 mr-1" />
                              ) : (
                                <XCircleIcon className="h-4 w-4 mr-1" />
                              )}
                              {appointment.status}
                            </span>
                          </p>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleEditClick(appointment)}
                          className="p-2 text-gray-600 hover:text-blue-600 transition-colors"
                        >
                          <PencilIcon className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteAppointment(appointment.id)}
                          className="p-2 text-gray-600 hover:text-red-600 transition-colors"
                        >
                          <TrashIcon className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default CitasList;
