export default function VideosAyuda() {
  return (
    <section className="text-center mt-20 mb-16">
      <h2 className="text-3xl font-semibold mb-6 text-gray-800">Videos de Ayuda</h2>
      <p className="text-lg text-gray-700 mb-8 max-w-3xl mx-auto">
        Si tienes dudas sobre cómo utilizar la plataforma o entender los procesos relacionados con la Zona Marítima Terrestre, estos videos pueden ayudarte:
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Video 1 */}
        <div className="w-full aspect-w-16 aspect-h-9">
          <iframe
            src="https://player.cloudinary.com/embed/?cloud_name=dxztlnzdp&public_id=Nicoya_Guanacaste_Costa_Rica_-_Hermosa_Vista_A%C3%A9rea_Con_Drone_4K_s3jp5y&profile=cld-default"
            style={{ width: '100%', height: '100%', aspectRatio: '16 / 9' }}
            allow="autoplay; fullscreen; encrypted-media; picture-in-picture"
            allowFullScreen
            frameBorder="0"
            title="Video de ayuda 1"
          ></iframe>
        </div>

        {/* Video 2 (usa otro ID si tienes otro) */}
        <div className="w-full aspect-w-16 aspect-h-9">
          <iframe
            src="https://player.cloudinary.com/embed/?cloud_name=dxztlnzdp&public_id=Nicoya_Guanacaste_Costa_Rica_-_Hermosa_Vista_A%C3%A9rea_Con_Drone_4K_s3jp5y&profile=cld-default"
            style={{ width: '100%', height: '100%', aspectRatio: '16 / 9' }}
            allow="autoplay; fullscreen; encrypted-media; picture-in-picture"
            allowFullScreen
            frameBorder="0"
            title="Video de ayuda 2"
          ></iframe>
        </div>
      </div>
    </section>
  );
}
