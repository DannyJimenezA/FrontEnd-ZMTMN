import { useEffect, useState } from 'react';
import axios from 'axios';
import { User } from '../Types'; // Asegúrate de que el path es correcto a tu archivo de interfaces
import ApiRoutes from '../../Components/ApiRoutes';

const MiPerfil = () => {
  const [perfil, setPerfil] = useState<User | null>(null);
  const [editando, setEditando] = useState(false);
  const [formData, setFormData] = useState<Partial<User>>({});

  // Obtenemos el token directamente del localStorage
  const token = localStorage.getItem('token');

  useEffect(() => {
    const fetchPerfil = async () => {
      try {
        const response = await axios.get(ApiRoutes.miPerfil, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        setPerfil(response.data);
        setFormData(response.data);
      } catch (error) {
        console.error('Error al cargar el perfil:', error);
      }
    };

    if (token) {
      fetchPerfil();
    }
  }, [token]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async () => {
    try {
      await axios.patch(ApiRoutes.miPerfil, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setEditando(false);
    } catch (error) {
      console.error('Error al guardar cambios:', error);
    }
  };

  if (!perfil) return <div className="text-center mt-10">Cargando perfil...</div>;

  return (
    <div className="max-w-xl mx-auto mt-10 p-6 border rounded shadow bg-white">
      <h2 className="text-2xl font-bold mb-6 text-center">Mi Información</h2>

      <div className="space-y-4">
        <label className="block">
          <span className="text-gray-700">Nombre:</span>
          <input
            className="border px-2 py-1 w-full rounded"
            type="text"
            name="nombre"
            value={formData.nombre || ''}
            onChange={handleChange}
            disabled={!editando}
          />
        </label>

        <label className="block">
          <span className="text-gray-700">Apellido 1:</span>
          <input
            className="border px-2 py-1 w-full rounded"
            type="text"
            name="apellido1"
            value={formData.apellido1 || ''}
            onChange={handleChange}
            disabled={!editando}
          />
        </label>

        <label className="block">
          <span className="text-gray-700">Apellido 2:</span>
          <input
            className="border px-2 py-1 w-full rounded"
            type="text"
            name="apellido2"
            value={formData.apellido2 || ''}
            onChange={handleChange}
            disabled={!editando}
          />
        </label>

        <label className="block">
          <span className="text-gray-700">Teléfono:</span>
          <input
            className="border px-2 py-1 w-full rounded"
            type="text"
            name="telefono"
            value={formData.telefono?.toString() || ''}
            onChange={handleChange}
            disabled={!editando}
          />
        </label>

        <label className="block">
          <span className="text-gray-700">Correo electrónico:</span>
          <input
            className="border px-2 py-1 w-full rounded"
            type="email"
            name="email"
            value={formData.email || ''}
            onChange={handleChange}
            disabled={!editando}
          />
        </label>
      </div>

      <div className="mt-6 text-center">
        {!editando ? (
          <button
            className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 transition"
            onClick={() => setEditando(true)}
          >
            Editar
          </button>
        ) : (
          <button
            className="bg-green-600 text-white px-6 py-2 rounded hover:bg-green-700 transition"
            onClick={handleSubmit}
          >
            Guardar cambios
          </button>
        )}
      </div>
    </div>
  );
};

export default MiPerfil;
