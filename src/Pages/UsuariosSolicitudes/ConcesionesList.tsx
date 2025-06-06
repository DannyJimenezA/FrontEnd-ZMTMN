import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Navbar from '../../Components/Navbar';
import { TrashIcon, XCircleIcon, CheckCircleIcon } from 'lucide-react';
import { FaFilePdf } from 'react-icons/fa';
import ApiRoutes from '../../Components/ApiRoutes';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';

interface User {
  id: number;
  cedula: string;
  nombre: string;
  apellido1: string;
  apellido2: string;
  telefono: string;
  email: string;
  password: string;
  isActive: boolean;
}

interface Concesion {
  id: number;
  // ArchivoAdjunto: string;
  ArchivoAdjunto: { nombre: string; ruta: string }[];
  Detalle: string;
  Date: string;
  status: string;
  user: User;
}

const ConcesionesList = () => {
  const [concesiones, setConcesiones] = useState<Concesion[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  const MySwal = withReactContent(Swal);


  const formatToDDMMYYYY = (isoDate: string): string => {
    const [year, month, day] = isoDate.split("-");
    return `${day}/${month}/${year}`;
  };



  /** Carga las concesiones del usuario autenticado */
  useEffect(() => {
    const fetchConcesiones = async () => {
      try {
        setIsLoading(true);
        const token = localStorage.getItem('token');
        if (!token) {
          navigate('/login');
          return;
        }

        const response = await axios.get(ApiRoutes.misconcesiones, {
          headers: { Authorization: `Bearer ${token}` },
        });

        // console.log("Concesiones recibidas:", response.data);

        if (!Array.isArray(response.data)) {
          throw new Error('La respuesta del backend no es un array válido.');
        }

        setConcesiones(response.data);
      } catch (error) {
        setError('Error al cargar las concesiones. Intente nuevamente.');
        console.error('Error obteniendo concesiones:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchConcesiones();
  }, [navigate]);

  /** Maneja la eliminación de una concesión */
  // const handleDeleteConcesion = async (id: number) => {
  //   if (!window.confirm('¿Está seguro que desea eliminar esta concesión?')) return;

  //   try {
  //     const token = localStorage.getItem('token');
  //     if (!token) {
  //       navigate('/login');
  //       return;
  //     }

  //     await axios.delete(`${ApiRoutes.eliminarconcesion}/${id}`, {
  //       headers: { Authorization: `Bearer ${token}` },
  //     });

  //     setConcesiones((prev) => prev.filter((concesion) => concesion.id !== id));
  //   } catch (error) {
  //     setError('Error al eliminar la concesión. Intente nuevamente.');
  //     console.error('Error eliminando concesión:', error);
  //   }
  // };
  const handleDeleteConcesion = async (id: number) => {
    const result = await MySwal.fire({
      title: '¿Estás seguro?',
      text: 'Esta acción eliminará la solicitud de concesión de forma permanente.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar',
    });

    if (!result.isConfirmed) return;

    try {
      const token = localStorage.getItem('token');
      if (!token) {
        navigate('/login');
        return;
      }

      await axios.delete(`${ApiRoutes.eliminarconcesion}/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setConcesiones((prev) => prev.filter((concesion) => concesion.id !== id));

      await MySwal.fire({
        icon: 'success',
        title: 'Eliminado',
        text: 'La concesión fue eliminada correctamente.',
        timer: 2000,
        showConfirmButton: false,
      });
    } catch (error) {
      setError('Error al eliminar la concesión. Intente nuevamente.');
      console.error('Error eliminando concesión:', error);
    }
  };


  const handleCreateConcesion = () => {
    navigate('/usuario-concesion');
  };
  /** Previsualiza un PDF en una nueva ventana */
  const handlePreviewPdf = (filePath: string) => {
    const fullUrl = `${ApiRoutes.urlBase}/${filePath}`;
    window.open(fullUrl, '_blank', 'width=800,height=600');
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
          <h1 className="text-3xl font-bold text-gray-900">Mis Solicitudes de Concesión</h1>
          <button
            onClick={handleCreateConcesion}
            className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
          >
            <FaFilePdf className="h-4 w-4 mr-2" />
            Enviar Solicitud
          </button>
        </div>

        {error && (
          <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-6">
            <p className="text-red-700">{error}</p>
          </div>
        )}

        {/* <div className="grid gap-6"> */}
        <div className="grid gap-6 grid-cols-1 sm:grid-cols-2">

          {concesiones.length === 0 ? (
            <div className="bg-white rounded-lg shadow p-6 text-center">
              <p className="text-gray-500">No se encontraron concesiones registradas</p>
            </div>
          ) : (
            concesiones.map((concesion) => (
              <div key={concesion.id} className="bg-white rounded-lg shadow p-6">
                <h3 className="text-lg font-semibold break-word">Detalle: {concesion.Detalle || "Sin descripción"}</h3>
               
                {/* <p className="text-sm text-gray-500">Fecha: {concesion.Date}</p> */}
                <p>Fecha: {concesion.Date ? formatToDDMMYYYY(concesion.Date) : 'No disponible'}</p>


                <div className="text-sm text-gray-500 mt-2">
                  <p>Archivos Adjuntos:</p>
                  <div className="flex flex-col gap-2 mt-2">
                    {Array.isArray(concesion.ArchivoAdjunto) &&
                      concesion.ArchivoAdjunto.map((file, index) => (
                        <button
                          key={index}
                          onClick={() => handlePreviewPdf(file.ruta)}
                          className="flex items-center gap-2 bg-gray-200 px-3 py-2 rounded-md hover:bg-gray-300 transition"
                        >
                          <FaFilePdf className="text-red-500 h-5 w-5" />
                          <span className="text-blue-600 hover:underline">
                            {file.nombre || `Archivo ${index + 1}`}
                          </span>
                        </button>
                      ))}
                  </div>

                </div>

                <p className="flex items-center gap-1 mt-4">
                  Estado:
                  <span className={`inline-flex items-center ${concesion.status === 'Aprobada' ? 'text-green-600' :
                    concesion.status === 'Denegada' ? 'text-red-600' : 'text-yellow-600'
                    }`}>
                    {concesion.status === 'Aprobada' && (
                      <CheckCircleIcon className="h-4 w-4 mr-1" />
                    )}
                    {concesion.status === 'Denegada' && (
                      <XCircleIcon className="h-4 w-4 mr-1" />
                    )}
                    {concesion.status === 'Pendiente' && (
                      <span className="inline-block w-4 h-4 border-2 border-yellow-500 rounded-full mr-1"></span>
                    )}
                    {concesion.status}

                  </span>
                </p>

                {concesion.status === 'Pendiente' && (
                  <button
                    onClick={() => handleDeleteConcesion(concesion.id)}
                    className="mt-4 px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors flex items-center"
                  >
                    <TrashIcon className="h-5 w-5 mr-2" />
                    Eliminar
                  </button>
                )}
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default ConcesionesList;
