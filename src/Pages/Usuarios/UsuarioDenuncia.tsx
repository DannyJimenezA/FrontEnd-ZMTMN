import React, { useState, useCallback, useEffect } from 'react';
import { useDropzone } from 'react-dropzone';
import { XMarkIcon } from '@heroicons/react/24/outline';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';
import ApiRoutes from '../../Components/ApiRoutes';

const MySwal = withReactContent(Swal);

interface UploadedFile {
  file: File;
  preview: string;
}

interface DenunciaFormData {
  Date: string;
  nombreDenunciante: string;
  cedulaDenunciante: string;
  notificacion: boolean;
  metodoNotificacion: string;
  medioNotificacion: string;
  tipoDenuncia: number;
  descripcion: string;
  lugarDenuncia: number;
  ubicacion: string;
  detallesEvidencia: string;
}

export default function UsuarioDenuncia() {
  const [formData, setFormData] = useState<DenunciaFormData>({
    Date: '',
    nombreDenunciante: '',
    cedulaDenunciante: '',
    notificacion: false,
    metodoNotificacion: '',
    medioNotificacion: '',
    tipoDenuncia: 0,
    descripcion: '',
    lugarDenuncia: 0,
    ubicacion: '',
    detallesEvidencia: '',
  });

  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);
  const [tiposDenuncia, setTiposDenuncia] = useState<any[]>([]);
  const [lugaresDenuncia, setLugaresDenuncia] = useState<any[]>([]);
  const navigate = useNavigate();
  const maxFiles = 10;

  useEffect(() => {
    fetch(`${ApiRoutes.urlBase}/tipo-denuncia`)
      .then(response => response.json())
      .then(data => setTiposDenuncia(data))
      .catch(error => console.error('Error al cargar los tipos de denuncia:', error));

    fetch(`${ApiRoutes.urlBase}/lugar-denuncia`)
      .then(response => response.json())
      .then(data => setLugaresDenuncia(data))
      .catch(error => console.error('Error al cargar los lugares de denuncia:', error));
  }, []);

  // const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
  //   const { name, value, type } = e.target;
  //   setFormData({
  //     ...formData,
  //     [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value,
  //   });
  // };
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;

    setFormData((prev) => {
      // Si cambia el método de notificación, limpiamos el medio
      if (name === 'metodoNotificacion') {
        return {
          ...prev,
          [name]: value,
          medioNotificacion: '', // <- se limpia automáticamente
        };
      }

      return {
        ...prev,
        [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value,
      };
    });
  };



  const onDrop = useCallback((acceptedFiles: File[]) => {
    if (uploadedFiles.length + acceptedFiles.length > maxFiles) {
      MySwal.fire({
        icon: 'warning',
        title: 'Límite de imágenes alcanzado',
        text: `Solo puedes subir hasta ${maxFiles} imágenes.`,
        confirmButtonText: 'Entendido',
      });
      return;
    }

    const newFiles = acceptedFiles.map(file => ({
      file,
      preview: URL.createObjectURL(file),
    }));

    setUploadedFiles(prevFiles => [...prevFiles, ...newFiles]);
  }, [uploadedFiles]);


  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      // maxFiles,
      'image/*': ['.png', '.jpg', '.jpeg'],
    },
  });

  const removeFile = (fileToRemove: UploadedFile) => {
    setUploadedFiles(prevFiles => prevFiles.filter(file => file !== fileToRemove));
    URL.revokeObjectURL(fileToRemove.preview);
  };

  // const handleSubmit = async (e: React.FormEvent) => {
  //   e.preventDefault();

  //   const requiredFields: string[] = [];

  //   if (!formData.tipoDenuncia) requiredFields.push("Tipo de Denuncia");
  //   if (!formData.lugarDenuncia) requiredFields.push("Lugar de Denuncia");
  //   if (!formData.descripcion.trim()) requiredFields.push("Descripción");
  //   if (!formData.ubicacion.trim()) requiredFields.push("Ubicación Exacta");
  //   if (!formData.detallesEvidencia.trim()) requiredFields.push("Detalles de la Evidencia");

  //   if (formData.notificacion) {
  //     if (!formData.metodoNotificacion.trim()) requiredFields.push("Método de Notificación");
  //     if (!formData.medioNotificacion.trim()) requiredFields.push("Medio de Notificación");
  //   }

  //   if (uploadedFiles.length === 0) requiredFields.push("Al menos una imagen");

  //   if (requiredFields.length > 0) {
  //     MySwal.fire({
  //       icon: 'warning',
  //       title: 'Campos obligatorios faltantes',
  //       html: `<ul class="text-left">${requiredFields.map(f => `<li>• ${f}</li>`).join('')}</ul>`,
  //       confirmButtonText: 'Entendido',
  //     });
  //     return;
  //   }

  //   const confirmacion = await MySwal.fire({
  //     title: '¿Está seguro de enviar la denuncia?',
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

  //   if (!confirmacion.isConfirmed) return;

  //   const formDataToSend = new FormData();
  //   Object.entries(formData).forEach(([key, value]) => {
  //     formDataToSend.append(key, String(value));
  //   });

  //   uploadedFiles.forEach(({ file }) => {
  //     formDataToSend.append('files', file);
  //   });

  //   try {
  //     const response = await fetch(`${ApiRoutes.denuncias}/upload`, {
  //       method: 'POST',
  //       body: formDataToSend,
  //     });

  //     if (response.ok) {
  //       await MySwal.fire({
  //         title: 'Denuncia enviada con éxito',
  //         text: '¡Tu denuncia se ha enviado exitosamente!',
  //         icon: 'success',
  //         timer: 2000,
  //         showConfirmButton: false,
  //       });
  //       navigate('/');
  //     } else {
  //       const errorData = await response.json();
  //       MySwal.fire('Error al enviar la denuncia', errorData.message, 'error');
  //     }
  //   } catch (error) {
  //     console.error('Error al enviar la denuncia:', error);
  //     MySwal.fire('Error', 'Hubo un error al enviar la denuncia. Intente nuevamente.', 'error');
  //   }
  // };

  const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();

  const requiredFields: string[] = [];

  if (!formData.tipoDenuncia) requiredFields.push("Tipo de Denuncia");
  if (!formData.lugarDenuncia) requiredFields.push("Lugar de Denuncia");
  if (!formData.descripcion.trim()) requiredFields.push("Descripción");
  if (!formData.ubicacion.trim()) requiredFields.push("Ubicación Exacta");
  if (!formData.detallesEvidencia.trim()) requiredFields.push("Detalles de la Evidencia");

  if (formData.notificacion) {
    if (!formData.metodoNotificacion.trim()) requiredFields.push("Método de Notificación");
    if (!formData.medioNotificacion.trim()) requiredFields.push("Medio de Notificación");
  }

  if (uploadedFiles.length === 0) requiredFields.push("Al menos una imagen");

  if (requiredFields.length > 0) {
    await MySwal.fire({
      icon: 'warning',
      title: 'Campos obligatorios faltantes',
      html: `<ul class="text-left">${requiredFields.map(f => `<li>• ${f}</li>`).join('')}</ul>`,
      confirmButtonText: 'Entendido',
    });
    return;
  }

  // ❗ Validación de palabras largas
  const camposALimitar = [
    { nombre: 'ubicación exacta', valor: formData.ubicacion },
    { nombre: 'detalles de evidencia', valor: formData.detallesEvidencia },
    { nombre: 'descripción', valor: formData.descripcion },
  ];

  const palabraLarga = camposALimitar.find(campo =>
    campo.valor.split(/\s+/).some(p => p.length > 30)
  );

  if (palabraLarga) {
    await MySwal.fire({
      icon: 'warning',
      title: 'Texto inválido',
      text: `El campo "${palabraLarga.nombre}" contiene una palabra muy larga (más de 30 caracteres seguidos).`,
      confirmButtonText: 'Entendido',
    });
    return;
  }

  const confirmacion = await MySwal.fire({
    title: '¿Está seguro de enviar la denuncia?',
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

  const formDataToSend = new FormData();
  Object.entries(formData).forEach(([key, value]) => {
    formDataToSend.append(key, String(value));
  });

  uploadedFiles.forEach(({ file }) => {
    formDataToSend.append('files', file);
  });

  try {
    const response = await fetch(`${ApiRoutes.denuncias}/upload`, {
      method: 'POST',
      body: formDataToSend,
    });

    if (response.ok) {
      await MySwal.fire({
        title: 'Denuncia enviada con éxito',
        text: '¡Tu denuncia se ha enviado exitosamente!',
        icon: 'success',
        timer: 2000,
        showConfirmButton: false,
      });
      navigate('/');
    } else {
      const errorData = await response.json();
      MySwal.fire('Error al enviar la denuncia', errorData.message, 'error');
    }
  } catch (error) {
    console.error('Error al enviar la denuncia:', error);
    MySwal.fire('Error', 'Hubo un error al enviar la denuncia. Intente nuevamente.', 'error');
  }
};


  return (
    <div className="container mx-auto px-4 py-12 bg-white rounded-lg shadow-lg">
      {/* Estilos para SweetAlert2 */}
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

      <h1 className="text-4xl font-bold mb-8 text-center">Formulario de Denuncias</h1>

      <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4" noValidate>
        {/* Primera fila: Nombre y Cédula */}
        <div>
          <label htmlFor="nombreDenunciante" className="block text-lg font-medium text-gray-700">
            Nombre del Denunciante *(opcional)
          </label>
          <input
            id="nombreDenunciante"
            maxLength={100}
            name="nombreDenunciante"
            type="text"
            value={formData.nombreDenunciante}
            onChange={handleInputChange}
            className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
            placeholder="Ingrese su nombre"
          />
        </div>
        {/* <div>
          <label htmlFor="cedulaDenunciante" className="block text-lg font-medium text-gray-700">
            Cédula del Denunciante *(opcional)
          </label>
          <input
            id="cedulaDenunciante"
            maxLength={12}
            name="cedulaDenunciante"
            type="text"
            value={formData.cedulaDenunciante}
            onChange={handleInputChange}
            className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
            placeholder="Ingrese su cédula "
          />
        </div> */}
        <div>
          <label htmlFor="cedulaDenunciante" className="block text-lg font-medium text-gray-700">
            Cédula del Denunciante *(opcional)
          </label>
          <input
            id="cedulaDenunciante"
            maxLength={12}
            name="cedulaDenunciante"
            type="text"
            inputMode="numeric"
            pattern="[0-9]*"
            value={formData.cedulaDenunciante}
            onChange={(e) => {
              const onlyNumbers = e.target.value.replace(/\D/g, '');
              setFormData(prev => ({ ...prev, cedulaDenunciante: onlyNumbers }));
            }}
            className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
            placeholder="Ingrese su cédula"
          />
        </div>


        {/* Tipo de Denuncia */}
        <div className="md:col-span-2">
          <label htmlFor="tipoDenuncia" className="block text-lg font-medium text-gray-700">
            Tipo de Denuncia
          </label>
          <select
            id="tipoDenuncia"
            name="tipoDenuncia"
            value={formData.tipoDenuncia}
            onChange={handleInputChange}
            required
            className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Seleccione un tipo de denuncia</option>
            {tiposDenuncia.map((tipo) => (
              <option key={tipo.id} value={tipo.id}>
                {tipo.descripcion}
              </option>
            ))}
          </select>
        </div>

        {/* Descripción */}
        <div className="md:col-span-2">
          <label htmlFor="descripcion" className="block text-lg font-medium text-gray-700">
            Descripción
          </label>
          <textarea
            id="descripcion"
            maxLength={250}
            name="descripcion"
            value={formData.descripcion}
            onChange={handleInputChange}
            required
            className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
            placeholder="Ingrese una descripción"
          />
        </div>

        {/* Lugar de Denuncia */}
        <div className="md:col-span-2">
          <label htmlFor="lugarDenuncia" className="block text-lg font-medium text-gray-700">
            Lugar de Denuncia
          </label>
          <select
            id="lugarDenuncia"
            name="lugarDenuncia"
            value={formData.lugarDenuncia}
            onChange={handleInputChange}
            required
            className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Seleccione un lugar de denuncia</option>
            {lugaresDenuncia.map((lugar) => (
              <option key={lugar.id} value={lugar.id}>
                {lugar.descripcion}
              </option>
            ))}
          </select>
        </div>

        {/* Ubicación Exacta */}
        <div className="md:col-span-2">
          <label htmlFor="ubicacion" className="block text-lg font-medium text-gray-700">
            Ubicación Exacta
          </label>
          <textarea
            id="ubicacion"
            maxLength={250}
            name="ubicacion"
            value={formData.ubicacion}
            onChange={handleInputChange}
            required
            className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
            placeholder="Ingrese la ubicación exacta"
          />
        </div>




        {/* Cuarta fila: Subir imágenes y detalles de evidencia */}
        <div className="md:col-span-2">
          <label htmlFor="ubicacion" className="block text-lg font-medium text-gray-700">
            Evidencia (Máximo 10 Imágenes)
          </label>
          <div
            {...getRootProps()}
            className={`p-8 border-2 border-dashed rounded-lg text-center cursor-pointer ${isDragActive ? 'border-blue-500 bg-blue-50' : 'border-gray-300 hover:border-gray-400'
              }`}
          >
            <input
              {...getInputProps({
                accept: 'image/jpeg, image/png',
              })}
            />

            {isDragActive ? (
              <p className="text-lg text-blue-500">Suelta las imágenes aquí...</p>
            ) : (
              <p className="text-lg text-gray-500">
                Arrastra y suelta imágenes aquí, o haz clic para seleccionar archivos (solo .jpg, .jpeg, .png)
              </p>
            )}
          </div>

          {/* {uploadedFiles.length > 0 && (
            <div className="mt-4">
              <h2 className="text-xl font-semibold mb-2">Imágenes Subidas</h2>
              <ul className="space-y-2">
                {uploadedFiles.map((file, index) => (
                  <li key={index} className="flex items-center justify-between bg-white p-3 rounded shadow">
                    <p className="font-medium">{file.file.name}</p>
                    <button onClick={() => removeFile(file)} className="text-red-500 hover:text-red-700">
                      <XMarkIcon className="h-5 w-5" />
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          )} */}
          {uploadedFiles.length > 0 && (
  <div className="mt-6">
    <h2 className="text-lg font-semibold mb-3">Archivos Subidos (Máximo 10 imágenes)</h2>
    <ul className="space-y-2">
      {uploadedFiles.map((file, index) => (
        <li
          key={index}
          className="flex justify-between items-center bg-gray-50 border border-gray-200 rounded-lg px-4 py-3"
        >
          <div>
            <p className="text-sm font-medium text-gray-800">{file.file.name}</p>
            <p className="text-xs text-gray-500">
              Tamaño: {(file.file.size / 1024 / 1024).toFixed(2)} MB
            </p>
          </div>
          <button
            onClick={() => removeFile(file)}
            className="text-red-600 hover:text-red-800 ml-4"
            aria-label="Eliminar archivo"
          >
            <XMarkIcon className="h-5 w-5" />
          </button>
        </li>
      ))}
    </ul>
  </div>
)}

        </div>

        <div className="md:col-span-2">
          <label htmlFor="detallesEvidencia" className="block text-lg font-medium text-gray-700">
            Detalles de la Evidencia
          </label>
          <textarea
            id="detallesEvidencia"
            maxLength={250}
            name="detallesEvidencia"
            value={formData.detallesEvidencia}
            onChange={handleInputChange}
            required
            className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
            placeholder="Ingrese una descripción de las imagenes"
          ></textarea>
        </div>

        {/* Quinta fila: Notificación */}
        <div className="md:col-span-2 flex items-center space-x-3">
          <input
            id="notificacion"
            name="notificacion"
            type="checkbox"
            checked={formData.notificacion}
            onChange={handleInputChange}
            className="h-5 w-5 text-blue-600 border-gray-300 rounded"
          />
          <label htmlFor="notificacion" className="text-lg font-medium text-gray-700">
            ¿Desea recibir notificaciones?
          </label>
        </div>

        {formData.notificacion && (
          <>
            <div>
              <label htmlFor="metodoNotificacion" className="block text-lg font-medium text-gray-700">
                Método de Notificación
              </label>
              <select
                id="metodoNotificacion"
                name="metodoNotificacion"
                value={formData.metodoNotificacion}
                onChange={handleInputChange}
                className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Seleccione un método de notificación</option>
                <option value="Teléfono">Teléfono</option>
                <option value="Correo electrónico">Correo electrónico</option>
              </select>
            </div>

            {/* <div>
              <label htmlFor="medioNotificacion" className="block text-lg font-medium text-gray-700">
                Medio de Notificación
              </label>
              <input
                id="medioNotificacion"
                name="medioNotificacion"
                type="text"
                value={formData.medioNotificacion}
                onChange={handleInputChange}
                className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
              />
            </div> */}
            <div>
              <label htmlFor="medioNotificacion" className="block text-lg font-medium text-gray-700">
                Medio de Notificación
              </label>
              <input
                id="medioNotificacion"
                name="medioNotificacion"
                type="text"
                maxLength={
                  formData.metodoNotificacion === 'Teléfono'
                    ? 8
                    : formData.metodoNotificacion === 'Correo electrónico'
                      ? 60
                      : undefined
                }
                disabled={!formData.metodoNotificacion}
                value={formData.medioNotificacion}
                onChange={handleInputChange}
                className={`mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 ${!formData.metodoNotificacion ? 'bg-gray-100 cursor-not-allowed' : ''
                  }`}
                placeholder={
                  !formData.metodoNotificacion
                    ? 'Seleccione un método primero'
                    : formData.metodoNotificacion === 'Teléfono'
                      ? 'Ingrese su número '
                      : 'Ingrese su correo electrónico'
                }
              />
            </div>


          </>
        )}

        {/* Botones */}
        <div className="md:col-span-2 flex justify-end space-x-4 mt-6">
          <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
            Enviar
          </button>
          <button onClick={() => navigate('/')} className="px-4 py-2 bg-gray-300 text-gray-700 rounded hover:bg-gray-400">
            Volver
          </button>
        </div>
      </form>

    </div>
  );
}
