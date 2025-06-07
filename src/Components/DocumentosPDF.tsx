import { FaFilePdf } from 'react-icons/fa';
import { FiDownload } from 'react-icons/fi';

const documentos = [
  {
    titulo: 'Formulario para Solicitud de Concesión',
    descripcion: '',
    tamano: '',
    href: '/DocsPdf/Formulario Solicitud de Concesión.pdf'
  },
  {
    titulo: 'Formulario de Solicitud de Prórroga de  Concesión',
    descripcion: '',
    tamano: '',
    href: '/DocsPdf/Formulario Solicitud de Prorroga de Concesión.pdf'
  },
  {
    titulo: 'Formulario de Solicitud de Uso Precario',
    descripcion: '',
    tamano: '',
    href: '/DocsPdf/Formulario Solicitud de Uso Precario.pdf'
  },
  {
    titulo: 'Formulario de Solicitud de Copia de Expediente',
    descripcion: '',
    tamano: '',
    href: '/DocsPdf/Formulario Solicitud de Expediente.pdf'
  },
    {
    titulo: 'Formulario de Solicitud de Cita / Audiencia',
    descripcion: '',
    tamano: '',
    href: '/DocsPdf/Formulario Solicitud de Cita.pdf'
  },
    {
    titulo: 'Formulario de Denuncia',
    descripcion: '',
    tamano: '',
    href: '/DocsPdf/Formulario de Denuncia.pdf'
  },
];

const DocumentosPDF = () => {
  return (
    <section className="mb-16 px-4">
      <h2 className="text-3xl font-semibold mb-4 text-gray-800 text-center">Documentos</h2>
      <p className="text-lg text-gray-600 mb-8 text-center">
        Aquí podrás descargar documentos relevantes del Departamento de Zona Marítima Terrestre:
      </p>
      <div className="grid md:grid-cols-3 gap-6 max-w-8xl mx-auto">
        {documentos.map((doc, index) => (
          <div key={index} className="bg-white p-6 rounded-xl shadow-md flex flex-col justify-between">
            <div className="flex items-start gap-4 mb-4">
              <FaFilePdf className="text-red-500 text-3xl" />
              <div>
                <h3 className="text-lg font-semibold text-gray-900 leading-snug">
                  {doc.titulo}
                </h3>
                <div className="flex items-center gap-2 mt-1">
                  <span className="bg-gray-100 text-xs font-medium text-gray-700 px-2 py-1 rounded-full">
                    PDF
                  </span>
                  <span className="text-sm text-gray-500">{doc.tamano}</span>
                </div>
                <p className="text-sm text-gray-600 mt-2">{doc.descripcion}</p>
              </div>
            </div>
            <a
              href={doc.href}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-auto self-end inline-flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-100 transition"
            >
              <FiDownload className="text-base" /> Descargar
            </a>
          </div>
        ))}
      </div>
    </section>
  );
};

export default DocumentosPDF;
