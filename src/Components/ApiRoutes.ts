const BASE_URL = 'http://localhost:3000';  // URL base de tu API



// http://localhost:3000
// https://backend-deptozmtmn.onrender.com

const ApiRoutes = {
  // Definimos las rutas de cada recurso
  usuarios: `${BASE_URL}/users`,
  auth: {
    login: `${BASE_URL}/auth/login`,
  },
  miPerfil: `${BASE_URL}/users/me`,
  concesiones: `${BASE_URL}/Concesiones`,
  misconcesiones: `${BASE_URL}/Concesiones/my-concesiones`,
  eliminarconcesion: `${BASE_URL}/Concesiones/my-concesiones`,
  prorrogas: `${BASE_URL}/Prorrogas`,
  misprorrogas: `${BASE_URL}/Prorrogas/my-prorrogas`,
  eliminarprorroga: `${BASE_URL}/Prorrogas/my-prorrogas`,
  precarios: `${BASE_URL}/Precario`,
  misprecarios: `${BASE_URL}/Precario/my-precarios`,
  eliminarprecario: `${BASE_URL}/Precario/my-precarios`,
  planos: `${BASE_URL}/revision-plano`,
  misplanos: `${BASE_URL}/revision-plano/my-planos`,
  eliminarplano: `${BASE_URL}/revision-plano/my-planos`,
  denuncias: `${BASE_URL}/denuncia`,
  citas:{
    crearcita: `${BASE_URL}/appointments`,
    miscitas: `${BASE_URL}/appointments/my-appointments`,
  },
  fechaDisponible: `${BASE_URL}/available-dates`,
  horasDisponibles:  `${BASE_URL}/appointments/citas-disponibles`,
  roles: `${BASE_URL}/roles`,
  expedientes: `${BASE_URL}/expedientes`,
  misexpedientes: `${BASE_URL}/expedientes/my-solicitudes`,
  eliminarexpediente: `${BASE_URL}/expedientes/my-solicitudes`,
  urlBase: `${BASE_URL}`,
  //miPerfil: `${BASE_URL}/users/me` // ruta para el cambio de informacion de la cuenta
};

export default ApiRoutes;
