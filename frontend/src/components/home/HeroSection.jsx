const HeroSection = () => {
  return (
    <section className="relative bg-gray-900 text-white">
      {/* Image d'arrière-plan avec overlay */}
      <div className="absolute inset-0 bg-cover bg-center bg-no-repeat" style={{ 
backgroundImage: "url('/assets/images/airport-hero.jpg')",
        filter: "brightness(0.6)"
      }}>
      </div>
      
      <div className="container-custom relative z-10 py-24 md:py-32">
        <div className="max-w-2xl">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">
            Navettes Aéroports à votre service
          </h1>
          <p className="text-xl md:text-2xl mb-8">
            Transport de qualité pour tous vos trajets vers les aéroports et gares.
            Jusqu'à 8 passagers, prise en charge à domicile, prix compétitifs.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4">
            <a 
              href="#advantages" 
              className="btn-secondary px-8 py-3 text-lg font-medium"
            >
              Nos avantages
            </a>
            <a href="/about" className="btn bg-white text-primary hover:bg-gray-100 px-8 py-3 text-lg font-medium">
              En savoir plus
            </a>
          </div>
        </div>
      </div>
    </section>
  )
}

export default HeroSection