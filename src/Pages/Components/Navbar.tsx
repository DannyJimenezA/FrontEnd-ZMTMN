import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Bars3Icon, XMarkIcon } from '@heroicons/react/24/outline';

interface NavbarProps {
  isFixed?: boolean;
}

export default function Navbar({ isFixed = false }: NavbarProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [prevScrollPos, setPrevScrollPos] = useState(0);
  const [visible, setVisible] = useState(true);
  let hideTimeout: ReturnType<typeof setTimeout>;

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollPos = window.pageYOffset;
      const isScrollingDown = prevScrollPos < currentScrollPos;
      const isScrollSignificant = Math.abs(prevScrollPos - currentScrollPos) > 10;

      if (!isScrollingDown && isScrollSignificant) {
        setVisible(true);

        // Clear any existing timeout and set a new one for 3 seconds
        clearTimeout(hideTimeout);
        hideTimeout = setTimeout(() => {
          setVisible(false);
        }, 3000); // 3 seconds
      } else if (isScrollingDown) {
        setVisible(false);
      }

      setPrevScrollPos(currentScrollPos);
    };

    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
      clearTimeout(hideTimeout); // Clear the timeout on component unmount
    };
  }, [prevScrollPos]);

  const navbarClasses = `
    w-full bg-white shadow-md transition-all duration-300 z-50
    ${isFixed ? 'fixed' : 'sticky'} top-0
    ${visible ? 'translate-y-0' : '-translate-y-full'}
  `;

  return (
    <nav className={navbarClasses}>
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center py-4">
          <Link to="/" className="text-2xl font-bold text-blue-600">Inicio</Link>
          
          {/* Desktop menu */}
          <div className="hidden md:flex space-x-8">
            <Link to="/usuario-concesion" className="text-gray-600 hover:text-blue-600">Concesiones</Link>
            <Link to="/usuario-prorroga" className="text-gray-600 hover:text-blue-600">Prorrogas</Link>
            <Link to="/usuario-precario" className="text-gray-600 hover:text-blue-600">Uso Precario</Link>
            <Link to="/usuario-plano" className="text-gray-600 hover:text-blue-600">Revisión de Planos</Link>
            <Link to="/usuario-cita" className="text-gray-600 hover:text-blue-600">Citas</Link>
            <Link to="/usuario-denuncia" className="text-gray-600 hover:text-blue-600">Denuncias</Link>
          </div>

          {/* Mobile menu button */}
          <button 
            className="md:hidden"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? (
              <XMarkIcon className="h-6 w-6 text-gray-600" />
            ) : (
              <Bars3Icon className="h-6 w-6 text-gray-600" />
            )}
          </button>
        </div>

        {/* Mobile menu */}
        {isMenuOpen && (
          <div className="md:hidden py-4">
            <Link to="/usuario-concesion" className="block py-2 text-gray-600 hover:text-blue-600">Concesiones</Link>
            <Link to="/usuario-prorroga" className="block py-2 text-gray-600 hover:text-blue-600">Prorrogas</Link>
            <Link to="/usuario-precario" className="block py-2 text-gray-600 hover:text-blue-600">Uso Precario</Link>
            <Link to="/usuario-plano" className="block py-2 text-gray-600 hover:text-blue-600">Revisión de Planos</Link>
            <Link to="/usuario-cita" className="block py-2 text-gray-600 hover:text-blue-600">Citas</Link>
            <Link to="/usuario-denuncia" className="block py-2 text-gray-600 hover:text-blue-600">Denuncias</Link>
          </div>
        )}
      </div>
    </nav>
  );
}
