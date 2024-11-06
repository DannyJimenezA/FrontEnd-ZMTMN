import React, { useState, useEffect } from 'react';
import Navbar from '../../Components/Navbar';

interface Request {
  id: number;
  type: string;
  status: string;
  date: string;
  description: string;
}

export default function UserRequests() {
  const [requests, setRequests] = useState<Request[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simular una llamada a la API para obtener las solicitudes del usuario
    const fetchRequests = async () => {
      setLoading(true);
      // Aquí normalmente harías una llamada a tu API
      const mockRequests: Request[] = [
        { id: 1, type: 'Concesión', status: 'En proceso', date: '2023-05-01', description: 'Solicitud de concesión para uso de agua' },
        { id: 2, type: 'Prórroga', status: 'Aprobada', date: '2023-04-15', description: 'Prórroga para concesión existente' },
        { id: 3, type: 'Uso Precario', status: 'Pendiente', date: '2023-05-10', description: 'Solicitud de uso precario de terreno' },
        { id: 4, type: 'Revisión de Planos', status: 'Rechazada', date: '2023-03-20', description: 'Revisión de planos para proyecto de construcción' },
      ];
      setRequests(mockRequests);
      setLoading(false);
    };

    fetchRequests();
  }, []);

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'en proceso':
        return 'bg-yellow-100 text-yellow-800';
      case 'aprobada':
        return 'bg-green-100 text-green-800';
      case 'pendiente':
        return 'bg-blue-100 text-blue-800';
      case 'rechazada':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return <div className="text-center py-10">Cargando solicitudes...</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
        <Navbar/>
      <h1 className="text-3xl font-bold mb-6">Mis Solicitudes</h1>
      {requests.length === 0 ? (
        <p>No tienes solicitudes activas.</p>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {requests.map((request) => (
            <div key={request.id} className="bg-white shadow-md rounded-lg p-6">
              <div className="flex justify-between items-start mb-4">
                <h2 className="text-xl font-semibold">{request.type}</h2>
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(request.status)}`}>
                  {request.status}
                </span>
              </div>
              <p className="text-gray-600 mb-2">{request.description}</p>
              <p className="text-sm text-gray-500">Fecha: {request.date}</p>
              <button className="mt-4 bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded">
                Ver detalles
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}