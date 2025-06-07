import { FaWhatsapp, FaQuestionCircle } from 'react-icons/fa';

export default function AyudaContactoFlotante() {
  return (
    <div className="fixed bottom-6 right-6 z-50 space-y-3">
      {/* Botón de WhatsApp */}
      <a
        href="https://wa.me/50626858700"
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center justify-center w-14 h-14 rounded-full bg-green-500 hover:bg-green-600 text-white shadow-lg transition-transform hover:scale-105"
        title="Contáctanos por WhatsApp"
      >
        <FaWhatsapp className="text-2xl" />
      </a>

      {/* Botón de ayuda */}
      <a
        href="#videos-ayuda"
        onClick={() => {
          setTimeout(() => {
            history.replaceState(null, '', window.location.pathname);
          }, 500); // espera un momento a que el scroll ocurra
        }}
        className="flex items-center justify-center w-14 h-14 rounded-full bg-blue-600 hover:bg-blue-700 text-white shadow-lg transition-transform hover:scale-105"
        title="Ver videos de ayuda"
      >
        <FaQuestionCircle className="text-2xl" />
      </a>

    </div>
  );
}
