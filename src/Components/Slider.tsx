// import { useEffect, useState } from 'react';
// import Slider from 'react-slick';
// import 'slick-carousel/slick/slick.css';
// import 'slick-carousel/slick/slick-theme.css';

// const images = [
//   "https://res.cloudinary.com/dxztlnzdp/image/upload/f_auto,q_auto,w_1280,c_fill/v1749261000/img05_ns145p.jpg",
//   "https://res.cloudinary.com/dxztlnzdp/image/upload/f_auto,q_auto,w_1280,c_fill/v1749261000/Img02_ajyyrw.jpg",
//   "https://res.cloudinary.com/dxztlnzdp/image/upload/f_auto,q_auto,w_1280,c_fill/v1749261000/Img03_q5xpcr.jpg",
// ];

// export default function ImageSlider() {
//   const [mounted, setMounted] = useState(false);

//   useEffect(() => {
//     const timer = setTimeout(() => setMounted(true), 100);
//     return () => clearTimeout(timer);
//   }, []);

//   const settings = {
//     dots: true,
//     infinite: true,
//     speed: 500,
//     slidesToShow: 1,
//     slidesToScroll: 1,
//     autoplay: true,
//     autoplaySpeed: 3000,
//   };

//   return (
//     <div className="w-full max-w-4xl mx-auto mb-16">
//       {!mounted ? (
//         // Imagen inicial para mejorar el LCP
//         <div className="w-full h-[400px] sm:h-[500px] overflow-hidden rounded-lg shadow-md">
//           <img
//             src={images[0]}
//             alt="Slide 1"
//             loading="eager"
//             width={1280}
//             height={720}
//             className="w-full h-full object-cover object-center"
//           />
//         </div>
//       ) : (
//         // Slider completo
//         <Slider {...settings}>
//           {images.map((image, index) => (
//             <div key={index} className="outline-none">
//               <div className="w-full h-[400px] sm:h-[500px] overflow-hidden rounded-lg shadow-md">
//                 <img
//                   src={image}
//                   alt={`Slide ${index + 1}`}
//                   loading="lazy"
//                   width={1280}
//                   height={720}
//                   className="w-full h-full object-cover object-center"
//                 />
//               </div>
//             </div>
//           ))}
//         </Slider>
//       )}
//     </div>
//   );
// }

import { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
// import { Button } from '@/components/ui/button';

type Slide = {
  src: string;
  alt: string;
  title: string;
  description: string;
};

const images: Slide[] = [
  {
    src: 'https://res.cloudinary.com/dxztlnzdp/image/upload/f_auto,q_auto,w_1280,c_fill/v1749261000/img05_ns145p.jpg',
    alt: 'Imagen 1',
    title: '',
    description: '',
  },
  {
    src: 'https://res.cloudinary.com/dxztlnzdp/image/upload/f_auto,q_auto,w_1280,c_fill/v1749261000/Img02_ajyyrw.jpg',
    alt: 'Imagen 2',
    title: '',
    description: '',
  },
  {
    src: 'https://res.cloudinary.com/dxztlnzdp/image/upload/f_auto,q_auto,w_1280,c_fill/v1749261000/Img03_q5xpcr.jpg',
    alt: 'Imagen 3',
    title: '',
    description: '',
  },
];

export default function CustomImageSlider(): JSX.Element {
  const [currentIndex, setCurrentIndex] = useState<number>(0);

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  };

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  };

  useEffect(() => {
    const interval = setInterval(nextSlide, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="relative max-w-4xl mx-auto mb-16">
      <div className="relative h-96 overflow-hidden rounded-lg shadow-md flex items-center">
        {/* Imagen */}
        <img
          src={images[currentIndex].src}
          alt={images[currentIndex].alt}
          className="w-full h-full object-cover transition-opacity duration-500"
        />

        {/* Gradient */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent z-10" />

        {/* Texto inferior izquierdo */}
        <div className="absolute bottom-4 left-4 text-white z-20">
          <h3 className="text-2xl font-bold">{images[currentIndex].title}</h3>
          <p className="text-gray-200">{images[currentIndex].description}</p>
        </div>

        {/* Dots */}
        <div className="absolute bottom-4 right-4 flex space-x-2 z-20">
          {/* {images.map((_, index) => (
            <button
              key={index}
              className={`w-3 h-3 rounded-full transition-colors ${
                index === currentIndex ? 'bg-blue-600' : 'bg-gray-300'
              }`}
              onClick={() => setCurrentIndex(index)}
            />
          ))} */}
          {images.map((_, index) => (
            <button
              aria-label={`Ir a la imagen ${index + 1}`}
              className={`w-5 h-5 p-2 rounded-full transition-colors ${index === currentIndex ? 'bg-blue-600' : 'bg-gray-300'
                }`}
              onClick={() => setCurrentIndex(index)}
            />

          ))}

        </div>

        {/* Botón Izquierdo */}
        <button
          onClick={prevSlide}
          aria-label="Imagen anterior"
          className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white text-gray-800 p-2 rounded-full z-20"
        >
          <ChevronLeft className="h-4 w-4" />
        </button>

        {/* Botón Derecho */}
        <button
          onClick={nextSlide}
          aria-label="Siguiente imagen"
          className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white text-gray-800 p-2 rounded-full z-20"
        >
          <ChevronRight className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}
