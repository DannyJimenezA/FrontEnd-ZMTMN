// import Slider from 'react-slick';
// import 'slick-carousel/slick/slick.css';
// import 'slick-carousel/slick/slick-theme.css';

// // Importa tus imágenes con la ruta correcta
// import image1 from '../Img/img05.jpg';
// import image2 from '../Img/Img02.jpg';
// import image3 from '../Img/Img03.jpg';

// // Asigna las imágenes importadas al array
// const images = [image1, image2, image3];

// export default function ImageSlider() {
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
// <div className="w-full max-w-4xl mx-auto mb-16">
//   <Slider {...settings}>
//     {images.map((image, index) => (
//       <div key={index} className="outline-none">
//         <div className="aspect-video overflow-hidden rounded-lg shadow-md">
//           <img
//             src={image}
//             alt={`Slide ${index + 1}`}
//             className="w-full h-full object-cover object-center"
//             loading="lazy"
//           />
//         </div>
//       </div>
//     ))}
//   </Slider>
// </div>

//   );
// }
import { useEffect, useState } from 'react';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';

const images = [
  "https://res.cloudinary.com/dxztlnzdp/image/upload/f_auto,q_auto,w_1280,c_fill/v1749261000/img05_ns145p.jpg",
  "https://res.cloudinary.com/dxztlnzdp/image/upload/f_auto,q_auto,w_1280,c_fill/v1749261000/Img02_ajyyrw.jpg",
  "https://res.cloudinary.com/dxztlnzdp/image/upload/f_auto,q_auto,w_1280,c_fill/v1749261000/Img03_q5xpcr.jpg",
];

export default function ImageSlider() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setMounted(true), 100);
    return () => clearTimeout(timer);
  }, []);

  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 3000,
  };

  return (
    <div className="w-full max-w-4xl mx-auto mb-16">
      {!mounted ? (
        // Imagen inicial para mejorar el LCP
        <div className="w-full h-[400px] sm:h-[500px] overflow-hidden rounded-lg shadow-md">
          <img
            src={images[0]}
            alt="Slide 1"
            loading="eager"
            width={1280}
            height={720}
            className="w-full h-full object-cover object-center"
          />
        </div>
      ) : (
        // Slider completo
        <Slider {...settings}>
          {images.map((image, index) => (
            <div key={index} className="outline-none">
              <div className="w-full h-[400px] sm:h-[500px] overflow-hidden rounded-lg shadow-md">
                <img
                  src={image}
                  alt={`Slide ${index + 1}`}
                  loading="lazy"
                  width={1280}
                  height={720}
                  className="w-full h-full object-cover object-center"
                />
              </div>
            </div>
          ))}
        </Slider>
      )}
    </div>
  );
}
