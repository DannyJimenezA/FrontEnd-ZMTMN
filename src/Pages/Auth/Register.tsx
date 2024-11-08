import React, { useState } from 'react'
import { EnvelopeIcon, IdentificationIcon, UserIcon, PhoneIcon, LockClosedIcon, EyeIcon, EyeSlashIcon } from '@heroicons/react/24/outline'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import ApiRoutes from '../../Components/ApiRoutes'

export default function Register() {
  const [formData, setFormData] = useState({
    email: '',
    cedula: '',
    nombre: '',
    apellido1: '',
    apellido2: '',
    telefono: '',
    password: '',
    confirmPassword: '',
    origin: "admin",
  })
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')
  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }))
  }

  // const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
  //   e.preventDefault()
    
  //   // Validación de formulario
  //   if (!formData.email || !formData.cedula || !formData.nombre || !formData.apellido1 || !formData.telefono || !formData.password || !formData.confirmPassword) {
  //     setErrorMessage('Por favor completa todos los campos')
  //     return
  //   }
  //   if (formData.password !== formData.confirmPassword) {
  //     setErrorMessage('Las contraseñas no coinciden')
  //     return
  //   }

  //   try {
  //     // Envío de datos al backend
  //     const response = await axios.post(`${ApiRoutes.usuarios}/register`, {
  //       ...formData,
  //       origin: 'admin'
  //     })

  //     // Manejo de respuesta exitosa
  //     console.log('Registro exitoso:', response.data)
  //     setErrorMessage('') // Limpiar mensajes de error
  //     navigate('/login')
  //   } catch (error) {
  //     // Manejo de errores en el envío al backend
  //     if (axios.isAxiosError(error) && error.response) {
  //       setErrorMessage(error.response.data.message || 'Error en el registro')
  //     } else {
  //       setErrorMessage('Error de conexión con el servidor')
  //     }
  //   }
  // }
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    // Validación de formulario
    if (!formData.email || !formData.cedula || !formData.nombre || !formData.apellido1 || !formData.telefono || !formData.password || !formData.confirmPassword) {
      setErrorMessage('Por favor completa todos los campos');
      return;
    }
    if (formData.password !== formData.confirmPassword) {
      setErrorMessage('Las contraseñas no coinciden');
      return;
    }
  
    try {
      // Envío de datos al backend
      const response = await axios.post(`${ApiRoutes.usuarios}/register`, {
        email: formData.email,
        cedula: formData.cedula,
        nombre: formData.nombre,
        apellido1: formData.apellido1,
        apellido2: formData.apellido2,
        telefono: formData.telefono,
        password: formData.password,
        origin: formData.origin, // Incluye origin explícitamente
      });
  
      // Manejo de respuesta exitosa
      console.log('Registro exitoso:', response.data);
      setErrorMessage(''); // Limpiar mensajes de error
      navigate('/login');
    } catch (error) {
      // Manejo de errores en el envío al backend
      if (axios.isAxiosError(error) && error.response) {
        setErrorMessage(error.response.data.message || 'Error en el registro');
      } else {
        setErrorMessage('Error de conexión con el servidor');
      }
    }
  }
  

  const handleBack = () => {
    navigate('/login'); // Redirige a la página de inicio de sesión
  };

  const renderInput = (name: string, label: string, type: string, icon: React.ReactNode, showPasswordToggle = false) => (
    <div>
      <label htmlFor={name} className="block text-sm font-medium text-gray-700 mb-2">
        {label}
      </label>
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          {icon}
        </div>
        <input
          id={name}
          name={name}
          type={showPasswordToggle ? (showPassword ? "text" : "password") : type}
          required
          className="appearance-none block w-full px-3 py-3 pl-10 border border-gray-300 rounded-lg placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
          placeholder={`Ingrese su ${label.toLowerCase()}`}
          value={formData[name as keyof typeof formData]}
          onChange={handleChange}
        />
        {showPasswordToggle && (
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute inset-y-0 right-0 pr-3 flex items-center focus:outline-none"
          >
            {showPassword ? (
              <EyeSlashIcon className="h-5 w-5 text-gray-400 hover:text-gray-500" aria-hidden="true" />
            ) : (
              <EyeIcon className="h-5 w-5 text-gray-400 hover:text-gray-500" aria-hidden="true" />
            )}
          </button>
        )}
      </div>
    </div>
  )

  return (
    <div className="min-h-screen w-full bg-gray-50">
      <div className="h-full w-full px-4 py-12 sm:px-6 lg:px-8">
        <div className="w-full max-w-4xl mx-auto">
          <div className="bg-white shadow-xl rounded-lg p-8">
            <h2 className="text-3xl font-extrabold text-gray-900 mb-8 text-center">
              Registro de Usuario
            </h2>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid gap-6 md:grid-cols-2">
                {renderInput('email', 'Correo electrónico', 'email', <EnvelopeIcon className="h-5 w-5 text-gray-400" aria-hidden="true" />)}
                {renderInput('cedula', 'Cédula', 'text', <IdentificationIcon className="h-5 w-5 text-gray-400" aria-hidden="true" />)}
                {renderInput('nombre', 'Nombre', 'text', <UserIcon className="h-5 w-5 text-gray-400" aria-hidden="true" />)}
                {renderInput('apellido1', 'Primer apellido', 'text', <UserIcon className="h-5 w-5 text-gray-400" aria-hidden="true" />)}
                {renderInput('apellido2', 'Segundo apellido', 'text', <UserIcon className="h-5 w-5 text-gray-400" aria-hidden="true" />)}
                {renderInput('telefono', 'Teléfono', 'tel', <PhoneIcon className="h-5 w-5 text-gray-400" aria-hidden="true" />)}
                {renderInput('password', 'Contraseña', 'password', <LockClosedIcon className="h-5 w-5 text-gray-400" aria-hidden="true" />, true)}
                <div>
                  <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-2">
                    Confirmar Contraseña
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <LockClosedIcon className="h-5 w-5 text-gray-400" aria-hidden="true" />
                    </div>
                    <input
                      id="confirmPassword"
                      name="confirmPassword"
                      type={showConfirmPassword ? "text" : "password"}
                      required
                      className="appearance-none block w-full px-3 py-3 pl-10 border border-gray-300 rounded-lg placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                      placeholder="Confirme su contraseña"
                      value={formData.confirmPassword}
                      onChange={handleChange}
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute inset-y-0 right-0 pr-3 flex items-center focus:outline-none"
                    >
                      {showConfirmPassword ? (
                        <EyeSlashIcon className="h-5 w-5 text-gray-400 hover:text-gray-500" aria-hidden="true" />
                      ) : (
                        <EyeIcon className="h-5 w-5 text-gray-400 hover:text-gray-500" aria-hidden="true" />
                      )}
                    </button>
                  </div>
                </div>
              </div>

              {errorMessage && <p className="text-red-500 text-center">{errorMessage}</p>}

              <div>
                <button
                  type="submit"
                  className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  Registrarse
                </button>
                <button 
                  type="button"
                  onClick={handleBack} 
                  className="w-full mt-2 flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-gray-700 bg-gray-300 hover:bg-gray-400 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
                >
                  Volver
                </button>
              </div>

              <div className="text-center text-sm">
                <span className="text-gray-600">¿Ya tienes una cuenta?</span>
                {' '}
                <a href="/login" className="font-medium text-blue-600 hover:text-blue-500">
                  Inicia sesión aquí
                </a>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}
