import { useEffect } from 'react'
import PriceCalculator from '../components/home/PriceCalculator'
import HeroSection from '../components/home/HeroSection'
import { Link } from 'react-router-dom'
import { Helmet } from 'react-helmet-async'

const Home = () => {
  // Scroll vers le haut lors du chargement de la page
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])

  return (
    <>
      {/* SEO Optimization */}
      <Helmet>
        <title>Navette Aéroport Belgique | Transport 8 places vers Zaventem, Brussels South</title>
        <meta name="description" content="Service de navette aéroport en Belgique. Transport confortable jusqu'à 8 passagers vers tous les aéroports (Bruxelles Zaventem, Brussels South, Amsterdam, Luxembourg, Paris). Tarifs compétitifs." />
        <meta name="keywords" content="navette aéroport, transfert aéroport Belgique, Zaventem, Brussels South, transport 8 places, réservation navette" />
        <link rel="canonical" href="https://navettesaeroports.be/" />
        <script type="application/ld+json">
          {`
            {
              "@context": "https://schema.org",
              "@type": "Service",
              "name": "Service de Navette Aéroport en Belgique",
              "description": "Transport confortable en van 8 places vers tous les aéroports belges et frontaliers (Bruxelles, Brussels South, Luxembourg, Amsterdam, Paris).",
              "provider": {
                "@type": "LocalBusiness",
                "name": "Navettes Aéroports Belgium",
                "email": "navettesaeroportsbelgium@gmail.com",
                "availableLanguage": ["French"]
              },
              "areaServed": {
                "@type": "Country",
                "name": "Belgium"
              },
              "serviceType": "Transport aéroport",
              "offers": {
                "@type": "AggregateOffer",
                "lowPrice": "80",
                "highPrice": "415",
                "priceCurrency": "EUR",
                "offerCount": "6"
              }
            }
          `}
        </script>
      </Helmet>

      {/* Section calculateur prioritaire en haut de la page */}
      <div id="calculator" className="py-12 bg-gray-100">
        <div className="container-custom">
          <div className="max-w-2xl mx-auto">
            <h1 className="text-4xl font-bold text-center mb-4">Navette Aéroport en Belgique | Transport 8 places</h1>
            <p className="text-xl text-center mb-8">Service de navette vers Bruxelles Zaventem, Brussels South et tous les aéroports</p>
            <div className="bg-white rounded-lg shadow-lg p-8">
              <PriceCalculator />
            </div>
          </div>
        </div>
      </div>
      
      {/* Hero Section en dessous du calculateur */}
      <HeroSection />
      
      {/* Section principale de présentation */}
      <section className="py-16 bg-white">
        <div className="container-custom">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold mb-6">Navette aéroport familiale avec van 8 places</h2>
              <p className="text-lg mb-4">
                Depuis plus de 10 ans, notre entreprise familiale de transport navette aéroport dessert toute la Belgique. Nous avons transporté des milliers de clients vers les aéroports de <strong>Bruxelles-Zaventem, Brussels South, Luxembourg, Amsterdam et Paris CDG</strong>.
              </p>
              <p className="text-lg mb-6">
                Notre flotte de <strong>vans spacieux</strong> peut accueillir <strong>jusqu'à 8 passagers</strong> avec leurs bagages, offrant un maximum de confort pour vos trajets vers l'aéroport.
              </p>
              
              <div className="bg-gray-50 p-6 rounded-lg shadow-sm mb-6">
                <h3 className="text-xl font-semibold mb-4">Notre service de navette aéroport comprend :</h3>
                <ul className="space-y-3">
                  <li className="flex items-start">
                    <svg className="h-6 w-6 text-primary mr-2 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                    </svg>
                    <span>Prise en charge à votre domicile en Belgique</span>
                  </li>
                  <li className="flex items-start">
                    <svg className="h-6 w-6 text-primary mr-2 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                    </svg>
                    <span>Chauffeurs professionnels et ponctuels</span>
                  </li>
                  <li className="flex items-start">
                    <svg className="h-6 w-6 text-primary mr-2 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                    </svg>
                    <span>Vans modernes climatisés pour 8 passagers</span>
                  </li>
                  <li className="flex items-start">
                    <svg className="h-6 w-6 text-primary mr-2 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                    </svg>
                    <span>Sièges enfants et réhausseurs sur demande</span>
                  </li>
                  <li className="flex items-start">
                    <svg className="h-6 w-6 text-primary mr-2 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                    </svg>
                    <span>Service disponible 7j/7 et 24h/24</span>
                  </li>
                  <li className="flex items-start">
                    <svg className="h-6 w-6 text-primary mr-2 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                    </svg>
                    <span>Tarifs transparents sans surprises</span>
                  </li>
                </ul>
              </div>
              
              <div className="text-center">
                <Link to="/#calculator" className="btn-primary px-8 py-3 text-lg inline-block">
                  Calculer votre tarif maintenant
                </Link>
              </div>
            </div>
            <div className="order-first lg:order-last">
              {/* Contenu textuel à la place de l'image */}
              <div className="bg-gray-100 rounded-lg p-8 text-center">
                <p className="font-bold text-xl mb-3">Van navette aéroport 8 places</p>
                <p>Transport confortable vers Bruxelles Zaventem et Brussels South</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Section Destinations aéroports */}
      <section id="destinations" className="py-16 bg-gray-50">
        <div className="container-custom">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Navettes vers tous les aéroports</h2>
            <p className="text-lg max-w-3xl mx-auto">
              Transport privé et confortable depuis votre domicile vers les aéroports belges et frontaliers
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="bg-white rounded-lg shadow-md overflow-hidden transition-transform duration-300 hover:shadow-lg hover:-translate-y-1">
              <div className="p-6">
                <h3 className="text-xl font-bold mb-2">Navette Aéroport de Bruxelles (Zaventem)</h3>
                <p className="text-gray-600 mb-3">Transport direct et confortable en van 8 places</p>
                <div className="flex justify-between items-center">
                  <p className="font-medium">À partir de <span className="text-xl font-bold text-primary">130€</span></p>
                  <Link to="/#calculator" className="btn-outline text-sm px-4 py-2">Calculer</Link>
                </div>
              </div>
            </div>
            
            <div className="bg-white rounded-lg shadow-md overflow-hidden transition-transform duration-300 hover:shadow-lg hover:-translate-y-1">
              <div className="p-6">
                <h3 className="text-xl font-bold mb-2">Navette Brussels South (Charleroi)</h3>
                <p className="text-gray-600 mb-3">Transport économique et rapide</p>
                <div className="flex justify-between items-center">
                  <p className="font-medium">À partir de <span className="text-xl font-bold text-primary">80€</span></p>
                  <Link to="/#calculator" className="btn-outline text-sm px-4 py-2">Calculer</Link>
                </div>
              </div>
            </div>
            
            <div className="bg-white rounded-lg shadow-md overflow-hidden transition-transform duration-300 hover:shadow-lg hover:-translate-y-1">
              <div className="p-6">
                <h3 className="text-xl font-bold mb-2">Navette Gare de Bruxelles-Midi</h3>
                <p className="text-gray-600 mb-3">Connexions TGV, Thalys et Eurostar</p>
                <div className="flex justify-between items-center">
                  <p className="font-medium">À partir de <span className="text-xl font-bold text-primary">130€</span></p>
                  <Link to="/#calculator" className="btn-outline text-sm px-4 py-2">Calculer</Link>
                </div>
              </div>
            </div>
            
            <div className="bg-white rounded-lg shadow-md overflow-hidden transition-transform duration-300 hover:shadow-lg hover:-translate-y-1">
              <div className="p-6">
                <h3 className="text-xl font-bold mb-2">Navette Aéroport de Luxembourg</h3>
                <p className="text-gray-600 mb-3">Transport confortable en van 8 places spacieux</p>
                <div className="flex justify-between items-center">
                  <p className="font-medium">À partir de <span className="text-xl font-bold text-primary">308€</span></p>
                  <Link to="/#calculator" className="btn-outline text-sm px-4 py-2">Calculer</Link>
                </div>
              </div>
            </div>
            
            <div className="bg-white rounded-lg shadow-md overflow-hidden transition-transform duration-300 hover:shadow-lg hover:-translate-y-1">
              <div className="p-6">
                <h3 className="text-xl font-bold mb-2">Navette Aéroport d'Amsterdam (Schiphol)</h3>
                <p className="text-gray-600 mb-3">Transport international longue distance</p>
                <div className="flex justify-between items-center">
                  <p className="font-medium">À partir de <span className="text-xl font-bold text-primary">409€</span></p>
                  <Link to="/#calculator" className="btn-outline text-sm px-4 py-2">Calculer</Link>
                </div>
              </div>
            </div>
            
            <div className="bg-white rounded-lg shadow-md overflow-hidden transition-transform duration-300 hover:shadow-lg hover:-translate-y-1">
              <div className="p-6">
                <h3 className="text-xl font-bold mb-2">Navette Aéroport de Paris CDG</h3>
                <p className="text-gray-600 mb-3">Transport international de qualité</p>
                <div className="flex justify-between items-center">
                  <p className="font-medium">À partir de <span className="text-xl font-bold text-primary">415€</span></p>
                  <Link to="/#calculator" className="btn-outline text-sm px-4 py-2">Calculer</Link>
                </div>
              </div>
            </div>
          </div>
          
          <div className="text-center mt-10">
            <Link to="/#calculator" className="btn-primary px-6 py-3">
              Calculer le prix de votre navette
            </Link>
          </div>
        </div>
      </section>
      
      {/* Section Avantages */}
      <section id="advantages" className="py-16 bg-white">
        <div className="container-custom">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Pourquoi choisir notre service de navette aéroport</h2>
            <p className="text-lg max-w-3xl mx-auto">
              Découvrez les raisons qui font de notre service de transport aéroport le choix idéal pour vos déplacements
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="bg-gray-50 p-8 rounded-lg shadow-sm hover:shadow-md transition-shadow">
              <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center text-white mb-6 mx-auto">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-8 h-8">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-3 text-center">Ponctualité garantie</h3>
              <p className="text-center">Nos chauffeurs arrivent toujours à l'avance pour s'assurer que vous arriverez à l'heure à votre vol, peu importe l'aéroport de destination.</p>
            </div>
            
            <div className="bg-gray-50 p-8 rounded-lg shadow-sm hover:shadow-md transition-shadow">
              <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center text-white mb-6 mx-auto">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-8 h-8">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-3 text-center">Prix compétitifs et transparents</h3>
              <p className="text-center">Nos tarifs de navette aéroport sont clairs et compétitifs, sans frais cachés ni suppléments imprévus pour tous vos trajets.</p>
            </div>
            
            <div className="bg-gray-50 p-8 rounded-lg shadow-sm hover:shadow-md transition-shadow">
              <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center text-white mb-6 mx-auto">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-8 h-8">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-3 text-center">Vans spacieux pour 8 passagers</h3>
              <p className="text-center">Nos vans peuvent accueillir jusqu'à 8 passagers avec leurs bagages pour un transport confortable vers tous les aéroports.</p>
            </div>
            
            <div className="bg-gray-50 p-8 rounded-lg shadow-sm hover:shadow-md transition-shadow">
              <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center text-white mb-6 mx-auto">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-8 h-8">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-3 text-center">Service client disponible</h3>
              <p className="text-center">Notre équipe familiale est joignable par email pour répondre à toutes vos questions concernant votre navette aéroport.</p>
            </div>
            
            <div className="bg-gray-50 p-8 rounded-lg shadow-sm hover:shadow-md transition-shadow">
              <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center text-white mb-6 mx-auto">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-8 h-8">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-3 text-center">Chauffeurs expérimentés</h3>
              <p className="text-center">Nos chauffeurs connaissent parfaitement les itinéraires vers tous les aéroports belges et frontaliers pour un trajet sans stress.</p>
            </div>
            
            <div className="bg-gray-50 p-8 rounded-lg shadow-sm hover:shadow-md transition-shadow">
              <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center text-white mb-6 mx-auto">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-8 h-8">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-3 text-center">Entreprise familiale belge</h3>
              <p className="text-center">Choisissez une entreprise familiale belge avec des milliers de transferts réussis et une parfaite connaissance du territoire.</p>
            </div>
          </div>
        </div>
      </section>
      
      {/* Section Étapes de réservation */}
      <section className="py-16 bg-gray-50">
        <div className="container-custom">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Comment réserver votre navette aéroport en 3 étapes</h2>
            <p className="text-lg max-w-3xl mx-auto">
              Réserver votre navette vers les aéroports belges ou frontaliers n'a jamais été aussi simple. Préparez-vous à voyager en toute tranquillité.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            <div className="relative">
              <div className="bg-white p-8 rounded-lg shadow-md relative z-10 h-full">
                <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center text-white text-2xl mb-6 mx-auto">
                  1
                </div>
                <h3 className="text-xl font-semibold mb-4 text-center">Calculez votre prix</h3>
                <p className="text-center">Entrez votre code postal, votre aéroport de destination et le nombre de passagers pour obtenir un tarif instantané.</p>
              </div>
              <div className="hidden md:block absolute top-1/2 right-0 w-1/4 h-0.5 bg-primary transform translate-x-1/2 z-0"></div>
            </div>
            
            <div className="relative">
              <div className="bg-white p-8 rounded-lg shadow-md relative z-10 h-full">
                <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center text-white text-2xl mb-6 mx-auto">
                  2
                </div>
                <h3 className="text-xl font-semibold mb-4 text-center">Complétez votre réservation</h3>
                <p className="text-center">Remplissez le formulaire avec vos informations personnelles et les détails de votre voyage vers l'aéroport choisi.</p>
              </div>
              <div className="hidden md:block absolute top-1/2 right-0 w-1/4 h-0.5 bg-primary transform translate-x-1/2 z-0"></div>
            </div>
            
            <div className="relative">
              <div className="bg-white p-8 rounded-lg shadow-md relative z-10 h-full">
                <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center text-white text-2xl mb-6 mx-auto">
                  3
                </div>
                <h3 className="text-xl font-semibold mb-4 text-center">Confirmez et détendez-vous</h3>
                <p className="text-center">Recevez votre confirmation par email et préparez-vous pour un transport sans stress dans notre van 8 places tout confort.</p>
              </div>
            </div>
          </div>
          
          <div className="text-center mt-12">
            <Link to="/#calculator" className="btn-primary px-8 py-3 text-lg">
              Réserver ma navette maintenant
            </Link>
          </div>
        </div>
      </section>
      
      {/* Call to Action Section */}
      <section className="py-16 bg-primary text-white">
        <div className="container-custom text-center">
          <h2 className="text-3xl font-bold mb-6">Prêt à réserver votre navette aéroport ?</h2>
          <p className="text-xl max-w-3xl mx-auto mb-8">
            Calculez votre tarif maintenant et réservez votre transport en toute simplicité. Notre équipe familiale est impatiente de vous accueillir dans nos vans 8 places et de vous offrir un service de navette aéroport de qualité.
          </p>
          <Link to="/#calculator" className="btn bg-white text-primary hover:bg-gray-100 hover:text-primary-dark px-10 py-4 text-lg font-medium inline-block rounded-lg shadow-md transition duration-300">
            Calculer le prix de ma navette
          </Link>
        </div>
      </section>
      
      {/* FAQ Section - Added for SEO */}
      <section className="py-16 bg-white">
        <div className="container-custom">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Questions fréquentes sur notre service de navette aéroport</h2>
            <p className="text-lg max-w-3xl mx-auto">
              Trouvez rapidement les réponses à vos questions concernant notre service de transport vers les aéroports
            </p>
          </div>
          
          <div className="max-w-4xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="bg-gray-50 p-6 rounded-lg">
                <h3 className="text-lg font-semibold mb-3">Combien de passagers pouvez-vous transporter ?</h3>
                <p>Nos vans spacieux peuvent accueillir jusqu'à 8 passagers avec leurs bagages pour un transport confortable vers tous les aéroports.</p>
              </div>
              
              <div className="bg-gray-50 p-6 rounded-lg">
                <h3 className="text-lg font-semibold mb-3">Quels aéroports desservez-vous ?</h3>
                <p>Nous desservons tous les aéroports belges (Bruxelles Zaventem, Brussels South) et frontaliers (Luxembourg, Amsterdam Schiphol, Paris CDG, Paris Orly).</p>
              </div>
              
              <div className="bg-gray-50 p-6 rounded-lg">
                <h3 className="text-lg font-semibold mb-3">Comment réserver une navette ?</h3>
                <p>Utilisez notre calculateur de prix en ligne, puis complétez le formulaire de réservation. Vous recevrez une confirmation par email.</p>
              </div>
              
              <div className="bg-gray-50 p-6 rounded-lg">
                <h3 className="text-lg font-semibold mb-3">Proposez-vous des sièges enfants ?</h3>
                <p>Oui, nous proposons des sièges enfants et des réhausseurs sur demande lors de votre réservation, sans frais supplémentaires.</p>
              </div>
              
              <div className="bg-gray-50 p-6 rounded-lg">
                <h3 className="text-lg font-semibold mb-3">Quel est le délai de réservation minimum ?</h3>
                <p>Nous recommandons de réserver 24h à l'avance, mais nous pouvons accepter des réservations de dernière minute selon disponibilité.</p>
              </div>
              
              <div className="bg-gray-50 p-6 rounded-lg">
                <h3 className="text-lg font-semibold mb-3">Comment se déroule le paiement ?</h3>
                <p>Le paiement de votre navette s'effectue par carte bancaire ou en espèces directement auprès de votre chauffeur le jour du transport.</p>
              </div>
            </div>
            
            <div className="text-center mt-10">
              <Link to="/contact" className="btn-outline px-6 py-3">
                Plus de questions ? Contactez-nous
              </Link>
            </div>
          </div>
        </div>
      </section>
      
      {/* Testimonials Section */}
      <section className="py-16 bg-gray-50">
        <div className="container-custom">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Ce que nos clients disent de notre service</h2>
            <p className="text-lg max-w-3xl mx-auto">
              Découvrez les avis de clients satisfaits qui ont fait appel à notre service de navette aéroport
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white p-8 rounded-lg shadow-md">
              <div className="flex items-center mb-4">
                <div className="flex text-yellow-400">
                  {[...Array(5)].map((_, i) => (
                    <svg key={i} className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118l-2.8-2.034c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>
              </div>
              <p className="mb-4 italic">« Service impeccable ! Notre chauffeur était à l'heure et très professionnel. Le van était spacieux et confortable pour notre famille de 5 personnes. Je recommande vivement cette navette pour vos transferts vers Zaventem. »</p>
              <div className="font-semibold">Sophie M.</div>
              <div className="text-sm text-gray-600">Transport vers Bruxelles Zaventem</div>
            </div>
            
            <div className="bg-white p-8 rounded-lg shadow-md">
              <div className="flex items-center mb-4">
                <div className="flex text-yellow-400">
                  {[...Array(5)].map((_, i) => (
                    <svg key={i} className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118l-2.8-2.034c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>
              </div>
              <p className="mb-4 italic">« J'utilise régulièrement ce service pour mes déplacements professionnels. Les chauffeurs sont toujours ponctuels et le service est fiable. Le rapport qualité-prix est excellent pour un transport vers Brussels South. »</p>
              <div className="font-semibold">Marc D.</div>
              <div className="text-sm text-gray-600">Transport vers Brussels South</div>
            </div>
            
            <div className="bg-white p-8 rounded-lg shadow-md">
              <div className="flex items-center mb-4">
                <div className="flex text-yellow-400">
                  {[...Array(5)].map((_, i) => (
                    <svg key={i} className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118l-2.8-2.034c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>
              </div>
              <p className="mb-4 italic">« Nous avons réservé une navette pour notre groupe de 7 personnes vers l'aéroport d'Amsterdam. Le service était parfait, le chauffeur très aimable et le van confortable malgré la distance. Je recommande sans hésitation ! »</p>
              <div className="font-semibold">Famille Dubois</div>
              <div className="text-sm text-gray-600">Transport vers Amsterdam Schiphol</div>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}

export default Home
