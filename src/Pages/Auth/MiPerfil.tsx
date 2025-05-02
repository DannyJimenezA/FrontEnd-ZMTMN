import { useEffect, useState } from 'react';
import axios from 'axios';
import ApiRoutes from '../../Components/ApiRoutes';
import { User } from '../Types';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';

const MySwal = withReactContent(Swal);

const MiPerfil = () => {
  const [perfil, setPerfil] = useState<User | null>(null);
  const [editando, setEditando] = useState(false);
  const [formData, setFormData] = useState<Partial<User>>({});
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPasswordFields, setShowPasswordFields] = useState(false);
  const [currentPassword, setCurrentPassword] = useState('');
  const [errores, setErrores] = useState<Record<string, string>>({});
  const [isSaving, setIsSaving] = useState(false); // 🔥 Nueva línea para mostrar el loader
  const navigate = useNavigate();

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

  const validateField = (name: string, value: string) => {
    switch (name) {
      case 'nombre':
      case 'apellido1':
      case 'apellido2':
        if (!value.trim()) return 'Este campo es obligatorio.';
        if (!/^[A-Za-zÁÉÍÓÚáéíóúÑñ\s]+$/.test(value)) return 'Solo letras permitidas.';
        return '';
      case 'telefono':
      case 'cedula':
        if (!/^\d+$/.test(value)) return 'Solo números permitidos.';
        if (value.length < 8) return 'Debe tener al menos 8 dígitos.';
        return '';
      case 'email':
        if (!/\S+@\S+\.\S+/.test(value)) return 'Correo electrónico inválido.';
        return '';
      default:
        return '';
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    const error = validateField(name, value);
    setErrores((prev) => ({ ...prev, [name]: error }));
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const validarFormulario = () => {
    const nuevosErrores: Record<string, string> = {};

    for (const key in formData) {
      const value = (formData as any)[key];
      const error = validateField(key, value);
      if (error) nuevosErrores[key] = error;
    }

    setErrores(nuevosErrores);

    return Object.keys(nuevosErrores).length === 0;
  };

  const validarContrasenaFuerte = (password: string): boolean => {
    const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;
    return regex.test(password);
  };

  const handleSubmit = async () => {
    if (!validarFormulario()) return;

    try {
      if (showPasswordFields) {
        if (newPassword !== confirmPassword) {
          await MySwal.fire({
            icon: 'error',
            title: 'Error',
            text: 'Las contraseñas no coinciden',
          });
          return;
        }

        if (!validarContrasenaFuerte(newPassword)) {
          await MySwal.fire({
            icon: 'warning',
            title: 'Contraseña inválida',
            text: 'Debe tener al menos 8 caracteres, una letra mayúscula, una minúscula y un número.',
          });
          return;
        }
      }

      const result = await MySwal.fire({
        title: '¿Guardar cambios?',
        text: 'Esta acción actualizará tu perfil.',
        icon: 'question',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Guardar',
        cancelButtonText: 'Cancelar',
      });

      if (!result.isConfirmed) return;

      const dataToSend = {
        ...formData,
        newPassword: newPassword || undefined,
        currentPassword: showPasswordFields ? currentPassword : undefined,
      };

      setIsSaving(true); // 🔥 Mostrar loader en botón

      await axios.patch(ApiRoutes.miPerfil, dataToSend, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setIsSaving(false); // 🔥 Quitar loader

      await MySwal.fire({
        icon: 'success',
        title: 'Perfil actualizado',
        text: showPasswordFields
          ? 'Tu perfil y contraseña se han actualizado correctamente.'
          : 'Tu perfil ha sido actualizado.',
      });

      setEditando(false);
      setShowPasswordFields(false);
      setNewPassword('');
      setConfirmPassword('');
      setCurrentPassword('');
    } catch (error: any) {
      setIsSaving(false); // 🔥 Quitar loader también si hay error
      console.error('Error al guardar cambios:', error);
      await MySwal.fire({
        icon: 'error',
        title: 'Error al actualizar',
        text: error?.response?.data?.message || 'Ocurrió un error inesperado.',
      });
    }
  };

  if (!perfil) return <div className="text-center mt-10">Cargando perfil...</div>;

  return (
    <div className="max-w-4xl mx-auto mt-10 p-6 border rounded shadow bg-white">
      <h2 className="text-2xl font-bold mb-6 text-center">Mi Información</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {[
          { label: 'Nombre', name: 'nombre', type: 'text' },
          { label: 'Apellido 1', name: 'apellido1', type: 'text' },
          { label: 'Apellido 2', name: 'apellido2', type: 'text' },
          { label: 'Teléfono', name: 'telefono', type: 'text' },
          { label: 'Cédula', name: 'cedula', type: 'text' },
          { label: 'Correo electrónico', name: 'email', type: 'email' },
        ].map((field) => (
          <div key={field.name}>
            <label className="block">
              <span className="text-gray-700">{field.label}:</span>
              <input
                className={`border px-2 py-1 w-full rounded ${
                  errores[field.name] ? 'border-red-500' : 'border-gray-300'
                }`}
                type={field.type}
                name={field.name}
                value={(formData as any)[field.name] || ''}
                onChange={handleChange}
                disabled={!editando}
              />
            </label>
            {errores[field.name] && (
              <p className="text-red-500 text-xs mt-1">{errores[field.name]}</p>
            )}
          </div>
        ))}
      </div>

      {/* Cambio de contraseña */}
      {editando && (
        <>
          <div className="mt-6">
            <button
              className="text-sm text-blue-600 underline"
              type="button"
              onClick={() => setShowPasswordFields(!showPasswordFields)}
            >
              {showPasswordFields ? 'Cancelar cambio de contraseña' : 'Cambiar contraseña'}
            </button>
          </div>

          {showPasswordFields && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
              <label className="block">
                <span className="text-gray-700">Contraseña actual:</span>
                <input
                  className="border px-2 py-1 w-full rounded border-gray-300"
                  type="password"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                />
              </label>

              <label className="block">
                <span className="text-gray-700">Nueva contraseña:</span>
                <input
                  className="border px-2 py-1 w-full rounded border-gray-300"
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                />
              </label>

              <label className="block md:col-span-2">
                <span className="text-gray-700">Confirmar contraseña:</span>
                <input
                  className="border px-2 py-1 w-full rounded border-gray-300"
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                />
              </label>
            </div>
          )}
        </>
      )}

      {/* Botones */}
      <div className="mt-6 flex justify-between">
        <button
          className="bg-gray-300 text-gray-700 px-6 py-2 rounded hover:bg-gray-400"
          onClick={() => navigate(-1)}
        >
          Volver
        </button>

        {!editando ? (
          <button
            className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 transition"
            onClick={() => setEditando(true)}
          >
            Editar
          </button>
        ) : (
          <button
            className="bg-green-600 text-white px-6 py-2 rounded hover:bg-green-700 transition flex items-center justify-center gap-2"
            onClick={handleSubmit}
            disabled={isSaving}
          >
            {isSaving ? (
              <span className="loader border-white border-t-green-700 rounded-full w-5 h-5 animate-spin"></span>
            ) : (
              'Guardar cambios'
            )}
          </button>
        )}
      </div>
    </div>
  );
};

export default MiPerfil;