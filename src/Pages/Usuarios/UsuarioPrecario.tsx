// import { useState, useCallback } from 'react';
// import { useDropzone } from 'react-dropzone';
// import { XMarkIcon } from '@heroicons/react/24/outline';
// import { useNavigate } from 'react-router-dom';

// interface UploadedFile {
//   file: File;
//   preview: string;
// }

// export default function UsuarioPrecario() {
//   const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);
//   const navigate = useNavigate();

//   const onDrop = useCallback((acceptedFiles: File[]) => {
//     const newFiles = acceptedFiles
//       .filter(file => file.type === 'application/pdf')
//       .map(file => ({
//         file,
//         preview: URL.createObjectURL(file)
//       }));
//     setUploadedFiles(prevFiles => [...prevFiles, ...newFiles]);
//   }, []);

//   const { getRootProps, getInputProps, isDragActive } = useDropzone({
//     onDrop,
//     accept: {
//       'application/pdf': ['.pdf']
//     }
//   });

//   const removeFile = (fileToRemove: UploadedFile) => {
//     setUploadedFiles(prevFiles => prevFiles.filter(file => file !== fileToRemove));
//     URL.revokeObjectURL(fileToRemove.preview);
//   };

//   const handleSend = () => {
//     // Lógica de envío, por ejemplo, hacer una petición al servidor
//     alert("Archivos enviados exitosamente!");
//     setUploadedFiles([]); // Opcional: limpia la lista después del envío
//   };

//   const handleBack = () => {
//     navigate('/'); // Redirige a la página principal o a otra ruta específica
//   };

//   return (
//     <div className="container mx-auto px-4 py-12">
//       <h1 className="text-4xl font-bold mb-8 text-center">Módulo de Solicitud de Uso Precario</h1>
      
//       <div 
//         {...getRootProps()} 
//         className={`p-8 border-2 border-dashed rounded-lg text-center cursor-pointer transition-colors ${
//           isDragActive ? 'border-blue-500 bg-blue-50' : 'border-gray-300 hover:border-gray-400'
//         }`}
//       >
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
//                   <p className="text-sm text-gray-500">
//                     Tamaño: {(file.file.size / 1024 / 1024).toFixed(2)} MB
//                   </p>
//                 </div>
//                 <button
//                   onClick={() => removeFile(file)}
//                   className="text-red-500 hover:text-red-700 transition-colors"
//                 >
//                   <XMarkIcon className="h-6 w-6" />
//                 </button>
//               </li>
//             ))}
//           </ul>
//         </div>
//       )}

//       {/* Botones de Enviar y Volver siempre visibles */}
//       <div className="flex justify-end space-x-4 mt-6">
//         <button 
//           onClick={handleBack} 
//           className="px-4 py-2 bg-gray-300 text-gray-700 font-semibold rounded hover:bg-gray-400 transition-colors"
//         >
//           Volver
//         </button>
//         <button 
//           onClick={handleSend} 
//           className="px-4 py-2 bg-blue-600 text-white font-semibold rounded hover:bg-blue-700 transition-colors"
//         >
//           Enviar
//         </button>
//       </div>
//     </div>
//   );
// }



import { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { XMarkIcon } from '@heroicons/react/24/outline';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';

const MySwal = withReactContent(Swal);

interface UploadedFile {
  file: File;
  preview: string;
}

export default function UsuarioPrecario() {
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);
  const navigate = useNavigate();

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const newFiles = acceptedFiles
      .filter(file => file.type === 'application/pdf')
      .map(file => ({
        file,
        preview: URL.createObjectURL(file)
      }));
    setUploadedFiles(prevFiles => [...prevFiles, ...newFiles]);
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/pdf': ['.pdf']
    }
  });

  const removeFile = (fileToRemove: UploadedFile) => {
    setUploadedFiles(prevFiles => prevFiles.filter(file => file !== fileToRemove));
    URL.revokeObjectURL(fileToRemove.preview);
  };

  const handleSend = () => {
    // Muestra una alerta de éxito usando SweetAlert2
    MySwal.fire({
      title: 'Archivos enviados',
      text: '¡Tus archivos han sido enviados exitosamente!',
      icon: 'success',
      confirmButtonText: 'Aceptar',
      timer: 3000, // La alerta se cierra automáticamente después de 3 segundos
    }).then(() => {
      // Limpia la lista de archivos después de cerrar la alerta
      setUploadedFiles([]);
    });
  };

  const handleBack = () => {
    navigate('/'); // Redirige a la página principal o a otra ruta específica
  };

  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="text-4xl font-bold mb-8 text-center">Módulo de Solicitud de Uso Precario</h1>
      
      <div 
        {...getRootProps()} 
        className={`p-8 border-2 border-dashed rounded-lg text-center cursor-pointer transition-colors ${
          isDragActive ? 'border-blue-500 bg-blue-50' : 'border-gray-300 hover:border-gray-400'
        }`}
      >
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
                  <p className="text-sm text-gray-500">
                    Tamaño: {(file.file.size / 1024 / 1024).toFixed(2)} MB
                  </p>
                </div>
                <button
                  onClick={() => removeFile(file)}
                  className="text-red-500 hover:text-red-700 transition-colors"
                >
                  <XMarkIcon className="h-6 w-6" />
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Botones de Enviar y Volver siempre visibles */}
      <div className="flex justify-end space-x-4 mt-6">
        <button 
          onClick={handleBack} 
          className="px-4 py-2 bg-gray-300 text-gray-700 font-semibold rounded hover:bg-gray-400 transition-colors"
        >
          Volver
        </button>
        <button 
          onClick={handleSend} 
          className="px-4 py-2 bg-blue-600 text-white font-semibold rounded hover:bg-blue-700 transition-colors"
        >
          Enviar
        </button>
      </div>
    </div>
  );
}
