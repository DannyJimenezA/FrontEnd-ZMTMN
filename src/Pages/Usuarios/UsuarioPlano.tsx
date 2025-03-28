// import { useState, useCallback, useEffect } from 'react';
// import { useDropzone } from 'react-dropzone';
// import { XMarkIcon } from '@heroicons/react/24/outline';
// import { useNavigate } from 'react-router-dom';
// import Swal from 'sweetalert2';
// import withReactContent from 'sweetalert2-react-content';
// import ApiRoutes from '../../Components/ApiRoutes';
// import { jwtDecode } from 'jwt-decode';

// const MySwal = withReactContent(Swal);

// interface UploadedFile {
//   file: File;
//   preview: string;
// }

// interface DecodedToken {
//   exp: number; // Expiration timestamp
//   sub: string; // User ID
// }

// export default function UsuarioPlano() {
//   const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);
//   const [comentario, setComentario] = useState(''); // Comentario adicional
//   const [numeroPlano, setNumeroPlano] = useState(''); // Número de plano
//   const [numeroExpediente, setNumeroExpediente] = useState(''); // Número de expediente
//   const navigate = useNavigate();

//   // Verificación de autenticación y expiración de token
//   useEffect(() => {
//     const token = localStorage.getItem('token');
//     if (!token) {
//       navigate('/login'); // Redirige al login si no hay token
//     } else {
//       try {
//         const decodedToken: DecodedToken = jwtDecode(token);
        
//         // Verifica si el token ha expirado
//         if (decodedToken.exp * 1000 < Date.now()) {
//           console.warn('Token expirado, redirigiendo al login');
//           localStorage.removeItem('token'); // Elimina el token expirado
//           navigate('/login');
//         }
//       } catch (e) {
//         console.error('Token inválido, redirigiendo al login');
//         localStorage.removeItem('token'); // Elimina el token inválido
//         navigate('/login');
//       }
//     }
//   }, [navigate]);

//   const onDrop = useCallback((acceptedFiles: File[]) => {
//     const newFiles = acceptedFiles
//       .filter(file => file.type === 'application/pdf')
//       .map(file => ({
//         file,
//         preview: URL.createObjectURL(file),
//       }));
//     setUploadedFiles(prevFiles => [...prevFiles, ...newFiles]);
//   }, []);

//   const { getRootProps, getInputProps, isDragActive } = useDropzone({
//     onDrop,
//     accept: { 'application/pdf': ['.pdf'] },
//   });

//   const removeFile = (fileToRemove: UploadedFile) => {
//     setUploadedFiles(prevFiles => prevFiles.filter(file => file !== fileToRemove));
//     URL.revokeObjectURL(fileToRemove.preview);
//   };

//   const handleSend = async () => {
//     if (uploadedFiles.length === 0) {
//       MySwal.fire('Error', 'No has subido ningún archivo.', 'error');
//       return;
//     }

//     const formData = new FormData();
//     uploadedFiles.forEach((file) => {
//       formData.append('files', file.file); // Asegúrate de agregar cada archivo directamente
//     });
//     formData.append('comentario', comentario || '');
//     formData.append('numeroPlano', numeroPlano);
//     formData.append('numeroExpediente', numeroExpediente);

//     const token = localStorage.getItem('token');
//     const decodedToken = parseJwt(token);
//     const userId = decodedToken?.sub;
//     if (!userId) {
//       MySwal.fire('Error', 'No se pudo obtener el ID del usuario.', 'error');
//       return;
//     }

//     formData.append('userId', userId);

//     try {
//       const response = await fetch(ApiRoutes.planos, {
//         method: 'POST',
//         headers: {
//           'Authorization': `Bearer ${token}`,
//         },
//         body: formData,
//       });

//       if (!response.ok) {
//         const errorResponse = await response.json();
//         console.error('Error en el servidor:', errorResponse);
//         throw new Error('Error al enviar los datos al servidor');
//       }

//       MySwal.fire('Archivos enviados', '¡Tus archivos y la descripción se han enviado exitosamente!', 'success')
//         .then(() => {
//           setUploadedFiles([]);
//           setComentario('');
//           setNumeroPlano('');
//           setNumeroExpediente('');
//         });
//     } catch (error) {
//       console.error('Error al enviar archivos:', error);
//       MySwal.fire('Error', 'Hubo un problema al enviar los archivos. Intente de nuevo.', 'error');
//     }
//   };

//   const parseJwt = (token: string | null) => {
//     if (!token) return null;
//     try {
//       return JSON.parse(atob(token.split('.')[1]));
//     } catch (e) {
//       return null;
//     }
//   };

//   const handleBack = () => {
//     navigate('/');
//   };

//   return (
//     <div className="container mx-auto px-4 py-12">
//       <h1 className="text-4xl font-bold mb-8 text-center">Módulo de Solicitud de Revisión de Planos</h1>
      
//       <div {...getRootProps()} className={`p-8 border-2 border-dashed rounded-lg text-center cursor-pointer transition-colors ${isDragActive ? 'border-blue-500 bg-blue-50' : 'border-gray-300 hover:border-gray-400'}`}>
//         <input {...getInputProps()} />
//         {isDragActive ? (
//           <p className="text-lg text-blue-500">Suelta los archivos aquí...</p>
//         ) : (
//           <p className="text-lg text-gray-500">
//             Arrastra y suelta archivos PDF aquí, o haz clic para seleccionar archivos
//           </p>
//         )}
//       </div>

//       {uploadedFiles.length > 0 && (
//         <div className="mt-8">
//           <h2 className="text-2xl font-semibold mb-4">Archivos Subidos</h2>
//           <ul className="space-y-4">
//             {uploadedFiles.map((file, index) => (
//               <li key={index} className="flex items-center justify-between bg-white p-4 rounded-lg shadow">
//                 <div>
//                   <p className="font-semibold">{file.file.name}</p>
//                   <p className="text-sm text-gray-500">Tamaño: {(file.file.size / 1024 / 1024).toFixed(2)} MB</p>
//                 </div>
//                 <button onClick={() => removeFile(file)} className="text-red-500 hover:text-red-700 transition-colors">
//                   <XMarkIcon className="h-6 w-6" />
//                 </button>
//               </li>
//             ))}
//           </ul>
//         </div>
//       )}

//       {/* Campos adicionales */}
//       <div className="mt-8">
//         <label htmlFor="comentario" className="block text-lg font-medium text-gray-700 mb-2">Comentario</label>
//         <textarea
//           id="comentario"
//           value={comentario}
//           onChange={(e) => setComentario(e.target.value)}
//           rows={3}
//           className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
//           placeholder="Agrega un comentario adicional sobre los archivos"
//         ></textarea>
//       </div>
      
//       <div className="mt-4">
//         <label htmlFor="numeroPlano" className="block text-lg font-medium text-gray-700 mb-2">Número de Plano</label>
//         <input
//           id="numeroPlano"
//           value={numeroPlano}
//           onChange={(e) => setNumeroPlano(e.target.value)}
//           className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
//           placeholder="Ingresa el número de plano"
//         />
//       </div>

//       <div className="mt-4">
//         <label htmlFor="numeroExpediente" className="block text-lg font-medium text-gray-700 mb-2">Número de Expediente</label>
//         <input
//           id="numeroExpediente"
//           value={numeroExpediente}
//           onChange={(e) => setNumeroExpediente(e.target.value)}
//           className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
//           placeholder="Ingresa el número de expediente"
//         />
//       </div>

//       <div className="flex justify-end space-x-4 mt-6">
//         <button onClick={handleBack} className="px-4 py-2 bg-gray-300 text-gray-700 font-semibold rounded hover:bg-gray-400 transition-colors">Volver</button>
//         <button onClick={handleSend} className="px-4 py-2 bg-blue-600 text-white font-semibold rounded hover:bg-blue-700 transition-colors">Enviar</button>
//       </div>
//     </div>
//   );
// }

import  { useState, useCallback, useEffect } from 'react';
import { useDropzone } from 'react-dropzone';
import { XMarkIcon } from '@heroicons/react/24/outline';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';
import ApiRoutes from '../../Components/ApiRoutes';
import {jwtDecode} from 'jwt-decode';

const MySwal = withReactContent(Swal);

interface UploadedFile {
  file: File;
  preview: string;
}

interface DecodedToken {
  exp: number;
  sub: string;
}

export default function UsuarioPlano() {
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);
  const [comentario, setComentario] = useState('');
  const [numeroPlano, setNumeroPlano] = useState('');
  const [numeroExpediente, setNumeroExpediente] = useState('');
  const navigate = useNavigate();

  // Verificación de autenticación y expiración de token
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
    } else {
      try {
        const decodedToken: DecodedToken = jwtDecode(token);
        if (decodedToken.exp * 1000 < Date.now()) {
          console.warn('Token expirado, redirigiendo al login');
          localStorage.removeItem('token');
          navigate('/login');
        }
      } catch (e) {
        console.error('Token inválido, redirigiendo al login');
        localStorage.removeItem('token');
        navigate('/login');
      }
    }
  }, [navigate]);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const newFiles = acceptedFiles
      .filter(file => file.type === 'application/pdf')
      .map(file => ({
        file,
        preview: URL.createObjectURL(file),
      }));
    setUploadedFiles(prevFiles => [...prevFiles, ...newFiles]);
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { 'application/pdf': ['.pdf'] },
  });

  const removeFile = (fileToRemove: UploadedFile) => {
    setUploadedFiles(prevFiles => prevFiles.filter(file => file !== fileToRemove));
    URL.revokeObjectURL(fileToRemove.preview);
  };

  const handleSend = async () => {
    if (uploadedFiles.length === 0) {
      MySwal.fire('Error', 'No has subido ningún archivo.', 'error');
      return;
    }

    const formData = new FormData();
    uploadedFiles.forEach((file) => {
      formData.append('files', file.file);
    });
    formData.append('Comentario', comentario || '');
    formData.append('NumeroPlano', numeroPlano);
    formData.append('NumeroExpediente', numeroExpediente);

    const token = localStorage.getItem('token');
    const decodedToken = parseJwt(token);
    const userId = decodedToken?.sub;
    if (!userId) {
      MySwal.fire('Error', 'No se pudo obtener el ID del usuario.', 'error');
      return;
    }

    formData.append('userId', userId);

    try {
      const response = await fetch(ApiRoutes.planos, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
        body: formData,
      });

      if (!response.ok) {
        const errorResponse = await response.json();
        console.error('Error en el servidor:', errorResponse);
        throw new Error('Error al enviar los datos al servidor');
      }

      MySwal.fire('Archivos enviados', '¡Tus archivos y la descripción se han enviado exitosamente!', 'success')
        .then(() => {
          setUploadedFiles([]);
          setComentario('');
          setNumeroPlano('');
          setNumeroExpediente('');
          navigate('/mis-planos');
        });
    } catch (error) {
      console.error('Error al enviar archivos:', error);
      MySwal.fire('Error', 'Hubo un problema al enviar los archivos. Intente de nuevo.', 'error');
    }
  };

  const parseJwt = (token: string | null) => {
    if (!token) return null;
    try {
      return JSON.parse(atob(token.split('.')[1]));
    } catch (e) {
      return null;
    }
  };

  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="text-4xl font-bold mb-8 text-center">Módulo de Solicitud de Revisión de Planos</h1>
      
      <div {...getRootProps()} className={`p-8 border-2 border-dashed rounded-lg text-center cursor-pointer transition-colors ${isDragActive ? 'border-blue-500 bg-blue-50' : 'border-gray-300 hover:border-gray-400'}`}>
        <input {...getInputProps()} />
        {isDragActive ? (
          <p className="text-lg text-blue-500">Suelta los archivos aquí...</p>
        ) : (
          <p className="text-lg text-gray-500">
            Arrastra y suelta archivos PDF aquí, o haz clic para seleccionar archivos
          </p>
        )}
      </div>

      {uploadedFiles.length > 0 && (
        <div className="mt-8">
          <h2 className="text-2xl font-semibold mb-4">Archivos Subidos</h2>
          <ul className="space-y-4">
            {uploadedFiles.map((file, index) => (
              <li key={index} className="flex items-center justify-between bg-white p-4 rounded-lg shadow">
                <div>
                  <p className="font-semibold">{file.file.name}</p>
                  <p className="text-sm text-gray-500">Tamaño: {(file.file.size / 1024 / 1024).toFixed(2)} MB</p>
                </div>
                <button onClick={() => removeFile(file)} className="text-red-500 hover:text-red-700 transition-colors">
                  <XMarkIcon className="h-6 w-6" />
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}

      <div className="mt-8">
        <label htmlFor="comentario" className="block text-lg font-medium text-gray-700 mb-2">Comentario</label>
        <textarea
          id="comentario"
          value={comentario}
          onChange={(e) => setComentario(e.target.value)}
          rows={3}
          className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
          placeholder="Agrega un comentario adicional sobre los archivos"
        ></textarea>
      </div>
      
      <div className="mt-4">
        <label htmlFor="numeroPlano" className="block text-lg font-medium text-gray-700 mb-2">Número de Plano</label>
        <input
          id="numeroPlano"
          value={numeroPlano}
          onChange={(e) => setNumeroPlano(e.target.value)}
          className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
          placeholder="Ingresa el número de plano"
        />
      </div>

      <div className="mt-4">
        <label htmlFor="numeroExpediente" className="block text-lg font-medium text-gray-700 mb-2">Número de Expediente</label>
        <input
          id="numeroExpediente"
          value={numeroExpediente}
          onChange={(e) => setNumeroExpediente(e.target.value)}
          className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
          placeholder="Ingresa el número de expediente"
        />
      </div>

      <div className="flex justify-end space-x-4 mt-6">
        <button onClick={() => navigate('/mis-planos')} className="px-4 py-2 bg-gray-300 text-gray-700 font-semibold rounded hover:bg-gray-400 transition-colors">Volver</button>
        <button onClick={handleSend} className="px-4 py-2 bg-blue-600 text-white font-semibold rounded hover:bg-blue-700 transition-colors">Enviar</button>
      </div>
    </div>
  );
}
