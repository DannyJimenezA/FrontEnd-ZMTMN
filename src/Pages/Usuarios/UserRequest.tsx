// import  { useState, useEffect } from 'react';
// import Navbar from '../../Components/Navbar';
// import ApiRoutes from '../../Components/ApiRoutes';

// interface Request {
//   id: number;
//   type: string;
//   status: string;
//   date: string;
//   description: string;
// }

// export default function UserRequests() {
//   const [requests, setRequests] = useState<Request[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState<string | null>(null);

//   useEffect(() => {
//     const fetchRequests = async () => {
//       setLoading(true);
//       setError(null); // Reset error state

//       try {
//         const token = localStorage.getItem('token');
//         if (!token) {
//           setError('No se encontró el token de autenticación');
//           setLoading(false);
//           return;
//         }

//         console.log('Token:', token);
//         const url = `${ApiRoutes.expedientes}/my-solicitudes`;
//         console.log('API URL:', url);

//         const response = await fetch(url, {
//           method: 'GET',
//           headers: {
//             'Authorization': `Bearer ${token}`,
//             'Content-Type': 'application/json',
//           },
//         });

//         if (!response.ok) {
//           const errorText = await response.text();
//           throw new Error(`Error ${response.status}: ${response.statusText} - ${errorText}`);
//         }

//         const data = await response.json();
//         console.log('Response data:', data);
//         setRequests(data);
//       } catch (error) {
//         if (error instanceof Error) {
//           console.error('Error fetching requests:', error.message);
//           setError(`Error al cargar las solicitudes: ${error.message}`);
//         } else {
//           console.error('Error desconocido:', error);
//           setError('Error desconocido al cargar las solicitudes');
//         }
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchRequests();
//   }, []);

//   const getStatusColor = (status: string) => {
//     switch (status.toLowerCase()) {
//       case 'en proceso':
//         return 'bg-yellow-100 text-yellow-800';
//       case 'aprobada':
//         return 'bg-green-100 text-green-800';
//       case 'pendiente':
//         return 'bg-blue-100 text-blue-800';
//       case 'rechazada':
//         return 'bg-red-100 text-red-800';
//       default:
//         return 'bg-gray-100 text-gray-800';
//     }
//   };

//   if (loading) {
//     return <div className="text-center py-10">Cargando solicitudes...</div>;
//   }

//   if (error) {
//     return <div className="text-center py-10 text-red-600">{error}</div>;
//   }

//   return (
//     <div className="container mx-auto px-4 py-8">
//       <Navbar />
//       <h1 className="text-3xl font-bold mb-6">Mis Solicitudes</h1>
//       {requests.length === 0 ? (
//         <p>No tienes solicitudes activas.</p>
//       ) : (
//         <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
//           {requests.map((request) => (
//             <div key={request.id} className="bg-white shadow-md rounded-lg p-6">
//               <div className="flex justify-between items-start mb-4">
//                 <h2 className="text-xl font-semibold">{request.type}</h2>
//                 <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(request.status)}`}>
//                   {request.status}
//                 </span>
//               </div>
//               <p className="text-gray-600 mb-2">{request.description}</p>
//               <p className="text-sm text-gray-500">Fecha: {request.date}</p>
//               <button className="mt-4 bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded">
//                 Ver detalles
//               </button>
//             </div>
//           ))}
//         </div>
//       )}
//     </div>
//   );
// }


import { useState, useEffect } from 'react';
import Navbar from '../../Components/Navbar';
import ApiRoutes from '../../Components/ApiRoutes';

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
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchRequests = async () => {
      setLoading(true);
      setError(null);

      try {
        const token = localStorage.getItem('token');
        if (!token) {
          setError('No se encontró el token de autenticación');
          setLoading(false);
          return;
        }

        console.log('Token:', token);
        const url = `${ApiRoutes.planos}/my-planos`; // Cambia la URL al endpoint correcto

        const response = await fetch(url, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });

        if (!response.ok) {
          const errorText = await response.text();
          throw new Error(`Error ${response.status}: ${response.statusText} - ${errorText}`);
        }

        const data = await response.json();
        console.log('Response data:', data);
        setRequests(data); // Asegúrate de que `data` sea un array de objetos que coincida con la interfaz `Request`
      } catch (error) {
        if (error instanceof Error) {
          console.error('Error fetching requests:', error.message);
          setError(`Error al cargar las solicitudes: ${error.message}`);
        } else {
          console.error('Error desconocido:', error);
          setError('Error desconocido al cargar las solicitudes');
        }
      } finally {
        setLoading(false);
      }
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

  if (error) {
    return <div className="text-center py-10 text-red-600">{error}</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <Navbar />
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
