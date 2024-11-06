import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';

const MySwal = withReactContent(Swal);

interface DecodedToken {
  exp: number; // Expiration timestamp
  sub: string;
}

export default function UsuarioExpediente() {
  const [telefonoSolicitante, setTelefonoSolicitante] = useState('');
  const [emailSolicitante, setEmailSolicitante] = useState('');
  const [numeroExpediente, setNumeroExpediente] = useState('');
  const [copiaCertificada, setCopiaCertificada] = useState<string | null>(null);
  const navigate = useNavigate();

  // Verificación de autenticación y expiración de token
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
    } else {
      const decodedToken = parseJwt(token);

      // Verifica si el token es válido y no ha expirado
      if (!decodedToken || decodedToken.exp * 1000 < Date.now()) {
        console.warn('Token expirado o inválido, redirigiendo al login');
        localStorage.removeItem('token');
        navigate('/login');
      }
    }
  }, [navigate]);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    const token = localStorage.getItem('token');
    if (!token) {
      console.error('Token no disponible');
      return;
    }

    const decodedToken = parseJwt(token);
    const userId = decodedToken?.sub;

    if (!userId) {
      console.error('No se pudo extraer el userId del token');
      return;
    }

    const solicitud = {
      userId,
      telefonoSolicitante,
      emailSolicitante,
      numeroExpediente,
      copiaCertificada,
    };

    try {
      const response = await fetch("http://localhost:3000/expedientes/solicitud", {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(solicitud),
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error('Error en la solicitud:', errorData);
        throw new Error('Error al enviar los datos al servidor');
      }

      MySwal.fire({
        title: 'Solicitud enviada',
        text: '¡La solicitud de expediente ha sido enviada exitosamente!',
        icon: 'success',
        confirmButtonText: 'Aceptar',
        timer: 3000,
      }).then(() => {
        setTelefonoSolicitante('');
        setEmailSolicitante('');
        setNumeroExpediente('');
        setCopiaCertificada(null);
        navigate('/');
      });
    } catch (error) {
      console.error('Error al enviar la solicitud:', error);
      MySwal.fire('Error', 'Hubo un problema al enviar la solicitud. Inténtalo de nuevo.', 'error');
    }
  };

  const parseJwt = (token: string | null): DecodedToken | null => {
    if (!token) return null;
    try {
      return JSON.parse(atob(token.split('.')[1]));
    } catch (e) {
      console.error('Error al decodificar el token:', e);
      return null;
    }
  };

  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="text-4xl font-bold mb-8 text-center">Módulo de Solicitud de Expediente</h1>

      <form onSubmit={handleSubmit}>
        <div className="mt-8">
          <label htmlFor="telefonoSolicitante" className="block text-lg font-medium text-gray-700 mb-2">
            Número telefónico:
          </label>
          <input
            type="tel"
            id="telefonoSolicitante"
            value={telefonoSolicitante}
            onChange={(e) => setTelefonoSolicitante(e.target.value)}
            required
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
            placeholder="Número telefónico del solicitante"
          />
        </div>

        <div className="mt-4">
          <label htmlFor="emailSolicitante" className="block text-lg font-medium text-gray-700 mb-2">
            Correo electrónico:
          </label>
          <input
            type="email"
            id="emailSolicitante"
            value={emailSolicitante}
            onChange={(e) => setEmailSolicitante(e.target.value)}
            required
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
            placeholder="Correo electrónico del solicitante"
          />
        </div>

        <div className="mt-4">
          <label htmlFor="numeroExpediente" className="block text-lg font-medium text-gray-700 mb-2">
            Nombre de expediente o número:
          </label>
          <input
            type="text"
            id="numeroExpediente"
            value={numeroExpediente}
            onChange={(e) => setNumeroExpediente(e.target.value)}
            required
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
            placeholder="Número o nombre del expediente"
          />
        </div>

        <div className="mt-4">
          <label className="block text-lg font-medium text-gray-700 mb-2">Copia certificada:</label>
          <div className="flex space-x-4">
            <label className="flex items-center">
              <input
                type="radio"
                name="copiaCertificada"
                value="sí"
                checked={copiaCertificada === 'sí'}
                onChange={() => setCopiaCertificada('sí')}
                required
                className="mr-2"
              />
              Sí
            </label>
            <label className="flex items-center">
              <input
                type="radio"
                name="copiaCertificada"
                value="no"
                checked={copiaCertificada === 'no'}
                onChange={() => setCopiaCertificada('no')}
                required
                className="mr-2"
              />
              No
            </label>
          </div>
        </div>

        <div className="flex justify-end space-x-4 mt-6">
          <button
            type="button"
            onClick={() => navigate('/')}
            className="px-4 py-2 bg-gray-300 text-gray-700 font-semibold rounded hover:bg-gray-400 transition-colors"
          >
            Volver
          </button>
          <button
            type="submit"
            className="px-4 py-2 bg-blue-600 text-white font-semibold rounded hover:bg-blue-700 transition-colors"
          >
            Enviar Solicitud
          </button>
        </div>
      </form>
    </div>
  );
}
