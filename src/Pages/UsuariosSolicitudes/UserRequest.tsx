// import { useState, useEffect } from 'react';
// import Navbar from '../../Components/Navbar';
// import ApiRoutes from '../../Components/ApiRoutes';
// import { RequestList } from './RequestList';
// import { RequestFilter } from './RequestFilter';

// interface Request {
//   id: number;
//   type: string;
//   status: string;
//   date: string;
//   description: string;
//   category: 'Plano' | 'Prórroga' | 'Precario' | 'Concesión' ;
// }

// export default function UserRequests() {
//   const [requests, setRequests] = useState<Request[]>([]); // Estado combinado para todos los tipos de solicitudes
//   const [filteredRequests, setFilteredRequests] = useState<Request[]>([]); // Estado filtrado
//   const [filter, setFilter] = useState<'Todas' | 'Plano' | 'Prórroga' | 'Precario' | 'Concesión'>('Todas'); // Filtro por categoría
//   const [loading, setLoading] = useState(true); // Estado de carga
//   const [error, setError] = useState<string | null>(null); // Estado de error

//   useEffect(() => {
//     const fetchData = async () => {
//       setLoading(true);
//       setError(null);

//       try {
//         const token = localStorage.getItem('token'); // Obtener el token del almacenamiento local
//         if (!token) {
//           setError('No se encontró el token de autenticación');
//           setLoading(false);
//           return;
//         }

//         // Realizar todas las peticiones simultáneamente
//         const [planosResponse, prorrogasResponse, precariosResponse, concesionesResponse] = await Promise.all([
//           fetch(`${ApiRoutes.planos}/my-planos`, {
//             method: 'GET',
//             headers: {
//               'Authorization': `Bearer ${token}`,
//               'Content-Type': 'application/json',
//             },
//           }),
//           fetch(`${ApiRoutes.prorrogas}/my-prorrogas`, {
//             method: 'GET',
//             headers: {
//               'Authorization': `Bearer ${token}`,
//               'Content-Type': 'application/json',
//             },
//           }),
//           fetch(`${ApiRoutes.precarios}/my-precarios`, {
//             method: 'GET',
//             headers: {
//               'Authorization': `Bearer ${token}`,
//               'Content-Type': 'application/json',
//             },
//           }),
//           fetch(`${ApiRoutes.concesiones}/my-concesiones`, {
//             method: 'GET',
//             headers: {
//               'Authorization': `Bearer ${token}`,
//               'Content-Type': 'application/json',
//             },
//           }),
//         ]);

//         const planosData = await planosResponse.json();
//         const prorrogasData = await prorrogasResponse.json();
//         const precariosData = await precariosResponse.json();
//         const concesionesData = await concesionesResponse.json();

//         const planos: Request[] = planosData.map((plan: any) => ({
//           id: plan.id,
//           type: plan.NumeroPlano || 'Plano sin título',
//           status: plan.status || 'Desconocido',
//           date: plan.Date || 'Sin fecha',
//           description: plan.Comentario || 'Sin descripción disponible',
//           category: 'Plano',
//         }));

//         const prorrogas: Request[] = prorrogasData.map((prorroga: any) => ({
//           id: prorroga.id,
//           type: prorroga.ArchivoAdjunto || 'Prórroga sin título',
//           status: prorroga.Status || 'Desconocido',
//           date: prorroga.Date || 'Sin fecha',
//           description: 'Prórroga solicitada por el usuario',
//           category: 'Prórroga',
//         }));

//         const precarios: Request[] = precariosData.map((precario: any) => ({
//           id: precario.id,
//           type: precario.ArchivoAdjunto || 'Precario sin título',
//           status: precario.Status || 'Desconocido',
//           date: precario.Date || 'Sin fecha',
//           description: 'Precario asociado al usuario',
//           category: 'Precario',
//         }));

//         const concesiones: Request[] = concesionesData.map((concesion: any) => ({
//           id: concesion.id,
//           type: concesion.ArchivoAdjunto || 'Concesión sin título',
//           status: concesion.Status || 'Desconocido',
//           date: concesion.Date || 'Sin fecha',
//           description: 'Concesión otorgada al usuario',
//           category: 'Concesión',
//         }));

//         const combinedRequests = [...planos, ...prorrogas, ...precarios, ...concesiones];
//         setRequests(combinedRequests);
//         setFilteredRequests(combinedRequests); // Inicialmente mostrar todas
//       } catch (error) {
//         setError(error instanceof Error ? error.message : 'Error desconocido');
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchData();
//   }, []);

//   useEffect(() => {
//     if (filter === 'Todas') {
//       setFilteredRequests(requests);
//     } else {
//       setFilteredRequests(requests.filter((request) => request.category === filter));
//     }
//   }, [filter, requests]);

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
//       <RequestFilter filter={filter} onFilterChange={setFilter} />
//       <RequestList requests={filteredRequests} />
//     </div>
//   );
// }

import { useState, useEffect } from 'react';
import Navbar from '../../Components/Navbar';
import ApiRoutes from '../../Components/ApiRoutes';
import { RequestList } from './RequestList';
import { RequestFilter } from './RequestFilter';

interface Request {
  id: number;
  type: string;
  status: string;
  date: string;
  description: string;
  category: 'Plano' | 'Prórroga' | 'Precario' | 'Concesión' | 'CopiaExpediente'; // Se añade la nueva categoría
}

export default function UserRequests() {
  const [requests, setRequests] = useState<Request[]>([]); 
  const [filteredRequests, setFilteredRequests] = useState<Request[]>([]);
  const [filter, setFilter] = useState<'Todas' | 'Plano' | 'Prórroga' | 'Precario' | 'Concesión' | 'CopiaExpediente'>('Todas');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);

      try {
        const token = localStorage.getItem('token'); 
        if (!token) {
          setError('No se encontró el token de autenticación');
          setLoading(false);
          return;
        }

        // Llamadas a los endpoints
        const [
          planosResponse,
          prorrogasResponse,
          precariosResponse,
          concesionesResponse,
          copiaExpedientesResponse,
        ] = await Promise.all([
          fetch(`${ApiRoutes.planos}/my-planos`, {
            method: 'GET',
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json',
            },
          }),
          fetch(`${ApiRoutes.prorrogas}/my-prorrogas`, {
            method: 'GET',
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json',
            },
          }),
          fetch(`${ApiRoutes.precarios}/my-precarios`, {
            method: 'GET',
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json',
            },
          }),
          fetch(`${ApiRoutes.concesiones}/my-concesiones`, {
            method: 'GET',
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json',
            },
          }),
          fetch(`${ApiRoutes.expedientes}/my-solicitudes`, {
            method: 'GET',
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json',
            },
          }),
        ]);

        // Procesar las respuestas
        const planosData = await planosResponse.json();
        const prorrogasData = await prorrogasResponse.json();
        const precariosData = await precariosResponse.json();
        const concesionesData = await concesionesResponse.json();
        const copiaExpedientesData = await copiaExpedientesResponse.json();

        // Mapeo de datos
        const planos: Request[] = planosData.map((plan: any) => ({
          id: plan.id,
          type: plan.NumeroPlano || 'Plano sin título',
          status: plan.status || 'Desconocido',
          date: plan.Date || 'Sin fecha',
          description: plan.Comentario || 'Sin descripción disponible',
          category: 'Plano',
        }));

        const prorrogas: Request[] = prorrogasData.map((prorroga: any) => ({
          id: prorroga.id,
          type: prorroga.ArchivoAdjunto || 'Prórroga sin título',
          status: prorroga.Status || 'Desconocido',
          date: prorroga.Date || 'Sin fecha',
          // description: 'Prórroga solicitada por el usuario',
          category: 'Prórroga',
        }));

        const precarios: Request[] = precariosData.map((precario: any) => ({
          id: precario.id,
          type: precario.ArchivoAdjunto || 'Precario sin título',
          status: precario.Status || 'Desconocido',
          date: precario.Date || 'Sin fecha',
          // description: 'Precario asociado al usuario',
          category: 'Precario',
        }));

        const concesiones: Request[] = concesionesData.map((concesion: any) => ({
          id: concesion.id,
          type: concesion.ArchivoAdjunto || 'Concesión sin título',
          status: concesion.Status || 'Desconocido',
          date: concesion.Date || 'Sin fecha',
          // description: 'Concesión otorgada al usuario',
          category: 'Concesión',
        }));

        const copiaExpedientes: Request[] = copiaExpedientesData.map((solicitud: any) => ({
          id: solicitud.idExpediente,
          type: solicitud.numeroExpediente || 'Copia de Expediente sin título',
          status: solicitud.status || 'Desconocido',
          date: solicitud.Date || 'Sin fecha',
          // description: `Solicitante: ${solicitud.nombreSolicitante}, Teléfono: ${solicitud.telefonoSolicitante}`,
          category: 'CopiaExpediente',
        }));

        // Combinar todas las solicitudes
        const combinedRequests = [
          ...planos,
          ...prorrogas,
          ...precarios,
          ...concesiones,
          ...copiaExpedientes,
        ];
        setRequests(combinedRequests);
        setFilteredRequests(combinedRequests);
      } catch (error) {
        setError(error instanceof Error ? error.message : 'Error desconocido');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    if (filter === 'Todas') {
      setFilteredRequests(requests);
    } else {
      setFilteredRequests(requests.filter((request) => request.category === filter));
    }
  }, [filter, requests]);

  if (loading) {
    return <div className="text-center py-10">Cargando solicitudes...</div>;
  }

  if (error) {
    return <div className="text-center py-10 text-red-600">{error}</div>;
  }

  // return (
  //   <div className="container mx-auto px-4 py-8">
  //     <Navbar />
  //     <h1 className="text-3xl font-bold mb-6">Mis Solicitudes</h1>
  //     <RequestFilter filter={filter} onFilterChange={setFilter} />
  //     <RequestList requests={filteredRequests} />
  //   </div>
  // );
  return (
    <div className="flex flex-col min-h-screen bg-gray-100"> {/* Clase de Tailwind para un diseño completo */}
      <Navbar />
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-6">Mis Solicitudes</h1>
        <RequestFilter filter={filter} onFilterChange={setFilter} />
        <RequestList requests={filteredRequests} />
      </div>
    </div>
  );
}
