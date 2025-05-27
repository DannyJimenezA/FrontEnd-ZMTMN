import { useEffect, useState } from 'react';
import axios from 'axios';
import ApiRoutes from '../../Components/ApiRoutes';
import { User } from '../Types';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';
import { FiEye, FiEyeOff } from 'react-icons/fi';

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
  const [isSaving, setIsSaving] = useState(false);
  const [tipoTelefono, setTipoTelefono] = useState<'nacional' | 'extranjero'>('nacional');
  const [tipoIdentificacion, setTipoIdentificacion] = useState<'nacional' | 'residente' | 'extranjero'>('nacional');
  const navigate = useNavigate();
  const token = localStorage.getItem('token');

  useEffect(() => {
    const fetchPerfil = async () => {
      try {
        const response = await axios.get(ApiRoutes.miPerfil, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const usuario = response.data;
        setPerfil(usuario);
        setFormData(usuario);
        setCurrentPassword('');

        if (usuario.cedula?.startsWith('CR-')) setTipoIdentificacion('nacional');
        else if (usuario.cedula?.startsWith('RES-')) setTipoIdentificacion('residente');
        else setTipoIdentificacion('extranjero');

        if (usuario.telefono?.startsWith('+506')) setTipoTelefono('nacional');
        else setTipoTelefono('extranjero');
      } catch (error) {
        console.error('Error al cargar el perfil:', error);
      }
    };
    if (token) fetchPerfil();
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
        if (tipoTelefono === 'nacional') {
          if (!/^\d{8}$/.test(value)) return 'Debe tener exactamente 8 dígitos.';
        } else {
          if (!/^\d{7,12}$/.test(value)) return 'Debe tener entre 7 y 12 dígitos.';
        }
        return '';
      case 'telefonoPrefijo':
        if (tipoTelefono === 'extranjero' && !/^\d{1,3}$/.test(value)) return 'Prefijo inválido';
        return '';
      case 'cedula':
        if (tipoIdentificacion === 'nacional' && !/^\d{9}$/.test(value)) return 'Debe tener 9 dígitos';
        if (tipoIdentificacion === 'residente' && !/^\d{11,12}$/.test(value)) return 'DIMEX inválido';
        if (tipoIdentificacion === 'extranjero' && !/^[a-zA-Z0-9]{6,20}$/.test(value)) return 'Pasaporte inválido';
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

  const [passwordVisibility, setPasswordVisibility] = useState({
    currentPassword: false,
    newPassword: false,
    confirmPassword: false,
  });

  const handleSubmit = async () => {
    if (!validarFormulario()) return;
    try {
      if (showPasswordFields) {
        if (newPassword !== confirmPassword) {
          await MySwal.fire({ icon: 'error', title: 'Error', text: 'Las contraseñas no coinciden' });
          return;
        }
        if (!validarContrasenaFuerte(newPassword)) {
          await MySwal.fire({ icon: 'warning', title: 'Contraseña inválida', text: 'Debe tener al menos 8 caracteres, una letra mayúscula, una minúscula y un número.' });
          return;
        }
      }

      const result = await MySwal.fire({ title: '¿Guardar cambios?', text: 'Esta acción actualizará tu perfil.', icon: 'question', showCancelButton: true, confirmButtonText: 'Guardar' });
      if (!result.isConfirmed) return;

      const dataToSend = {
        ...formData,
        newPassword: newPassword || undefined,
        currentPassword: showPasswordFields ? currentPassword : undefined,
      };
      setIsSaving(true);

      await axios.patch(ApiRoutes.miPerfil, dataToSend, { headers: { Authorization: `Bearer ${token}` } });
      setIsSaving(false);

      await MySwal.fire({ icon: 'success', title: 'Perfil actualizado', text: 'Cambios guardados correctamente.' });
      setEditando(false);
      setShowPasswordFields(false);
      setNewPassword('');
      setConfirmPassword('');
      setCurrentPassword('');
    } catch (error: any) {
      setIsSaving(false);
      await MySwal.fire({ icon: 'error', title: 'Error', text: error?.response?.data?.message || 'Error inesperado.' });
    }
  };

  if (!perfil) return <div className="text-center mt-10">Cargando perfil...</div>;

  return (
    <div className="max-w-4xl mx-auto mt-10 p-6 border rounded shadow bg-white">
      <h2 className="text-2xl font-bold mb-6 text-center">Mi Información</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {['nombre', 'apellido1', 'apellido2', 'email'].map((field) => (
          <div key={field}>
            <label className="block text-gray-700">{field.charAt(0).toUpperCase() + field.slice(1)}:</label>
            <input
              className={`border px-2 py-1 w-full rounded ${errores[field] ? 'border-red-500' : 'border-gray-300'}`}
              type="text"
              name={field}
              value={(formData as any)[field] || ''}
              onChange={handleChange}
              disabled={!editando}
              maxLength={field === 'email' ? 60 : 30}
            />
            {errores[field] && <p className="text-sm text-red-500">{errores[field]}</p>}
          </div>
        ))}

        {/* Teléfono */}
        <div>
          <label className="text-gray-700 block">Tipo de Teléfono:</label>
          <select
            className="w-full border px-2 py-1 rounded border-gray-300"
            value={tipoTelefono}
            onChange={(e) => setTipoTelefono(e.target.value as any)}
            disabled={!editando}
          >
            <option value="nacional">Nacional</option>
            <option value="extranjero">Extranjero</option>
          </select>
        </div>

        {tipoTelefono === 'extranjero' ? (
          <div className="md:col-span-2">
            <label className="text-gray-700 block">Teléfono Extranjero:</label>
            <div className="flex gap-2 items-center">
              <span className="inline-flex items-center px-3 border border-r-0 border-gray-300 bg-gray-100 text-gray-500 text-sm rounded-l-md">+</span>
              <input
                type="text"
                name="telefonoPrefijo"
                value={(formData as any).telefonoPrefijo || ''}
                onChange={handleChange}
                className="w-20 px-3 py-2 border border-gray-300 rounded-md"
                maxLength={3}
                placeholder="Pref"
                disabled={!editando}
              />
              <input
                type="tel"
                name="telefono"
                value={(formData as any).telefono || ''}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
                maxLength={12}
                disabled={!editando}
              />
            </div>
          </div>
        ) : (
          <div>
            <label className="text-gray-700 block">Teléfono:</label>
            <div className="flex">
              <span className="inline-flex items-center px-3 border border-r-0 border-gray-300 bg-gray-100 text-gray-500 text-sm rounded-l-md">+506</span>
              <input
                type="tel"
                name="telefono"
                value={(formData as any).telefono || ''}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-r-md"
                maxLength={8}
                disabled={!editando}
              />
            </div>
          </div>
        )}

        {/* Identificación */}
        <div>
          <label className="text-gray-700 block">Tipo de Identificación:</label>
          <select
            className="w-full border px-2 py-1 rounded border-gray-300"
            value={tipoIdentificacion}
            onChange={(e) => setTipoIdentificacion(e.target.value as any)}
            disabled={!editando}
          >
            <option value="nacional">Cédula Nacional</option>
            <option value="residente">DIMEX</option>
            <option value="extranjero">Pasaporte</option>
          </select>
        </div>

        <div>
          <label className="text-gray-700 block">
            {tipoIdentificacion === 'nacional' ? 'Cédula Nacional' : tipoIdentificacion === 'residente' ? 'DIMEX' : 'Pasaporte'}
          </label>
          <input
            className={`border px-2 py-1 w-full rounded ${errores.cedula ? 'border-red-500' : 'border-gray-300'}`}
            type="text"
            name="cedula"
            value={(formData as any).cedula || ''}
            onChange={handleChange}
            maxLength={tipoIdentificacion === 'extranjero' ? 20 : 12}
            disabled={!editando}
          />
          {errores.cedula && <p className="text-sm text-red-500">{errores.cedula}</p>}
        </div>
      </div>

      {/* Cambio contraseña y botones */}
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
              {[{ label: 'Contraseña actual', name: 'currentPassword', value: currentPassword, setValue: setCurrentPassword },
                { label: 'Nueva contraseña', name: 'newPassword', value: newPassword, setValue: setNewPassword },
                { label: 'Confirmar contraseña', name: 'confirmPassword', value: confirmPassword, setValue: setConfirmPassword, colSpan: 'md:col-span-2' },
              ].map(field => (
                <label key={field.name} className={`block ${field.colSpan || ''}`}>
                  <span className="text-gray-700">{field.label}:</span>
                  <div className="relative">
                    <input
                      className="border px-2 py-1 w-full rounded border-gray-300 pr-10"
                      type={passwordVisibility[field.name as keyof typeof passwordVisibility] ? 'text' : 'password'}
                      value={field.value}
                      onChange={(e) => field.setValue(e.target.value)}
                    />
                    <div className="absolute inset-y-0 right-2 flex items-center">
                      <button
                        type="button"
                        onClick={() => setPasswordVisibility(prev => ({
                          ...prev,
                          [field.name]: !prev[field.name as keyof typeof passwordVisibility],
                        }))}
                        className="text-gray-600 hover:text-gray-800 focus:outline-none"
                        tabIndex={-1}
                      >
                        {passwordVisibility[field.name as keyof typeof passwordVisibility] ? <FiEyeOff className="h-5 w-5" /> : <FiEye className="h-5 w-5" />}
                      </button>
                    </div>
                  </div>
                </label>
              ))}
            </div>
          )}
        </>
      )}

      <div className="mt-6 flex justify-between">
        {!editando ? (
          <button className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 transition" onClick={() => setEditando(true)}>Editar</button>
        ) : (
          <button
            className="bg-green-600 text-white px-6 py-2 rounded hover:bg-green-700 transition flex items-center justify-center gap-2"
            onClick={handleSubmit}
            disabled={isSaving}
          >
            {isSaving ? <span className="loader border-white border-t-green-700 rounded-full w-5 h-5 animate-spin"></span> : 'Guardar cambios'}
          </button>
        )}
        <button className="bg-gray-300 text-gray-700 px-6 py-2 rounded hover:bg-gray-400" onClick={() => navigate(-1)}>Volver</button>
      </div>
    </div>
  );
};

export default MiPerfil;