import BookingForm from '../components/booking/BookingForm'
import { useBooking } from '../contexts/BookingContext'
import { useNavigate } from 'react-router-dom'
import { useEffect } from 'react'

const Booking = () => {
  const { priceCalculated } = useBooking()
  const navigate = useNavigate()
  
  // Rediriger vers la page d'accueil si aucun prix n'a été calculé
  useEffect(() => {
    if (!priceCalculated) {
      navigate('/')
    }
  }, [priceCalculated, navigate])
  
  if (!priceCalculated) {
    return null // Ne rien afficher pendant la redirection
  }

  return (
    <div className="py-8 bg-gray-50">
      <div className="container-custom">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-3xl font-bold text-center mb-6">Réservation de votre navette aéroport depuis La Louvière et Charleroi</h1>
          <p className="text-center mb-8">
            Complétez votre réservation pour notre service de transport en van 8 places vers les aéroports belges et frontaliers.
          </p>
          
          <div className="bg-white rounded-lg shadow-md p-6 mb-8">
            <h2 className="text-xl font-semibold mb-4">Avantages de notre service de navette aéroport</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-start">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-primary mt-1 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <p>Transport porte-à-porte depuis La Louvière et Charleroi et leur région</p>
              </div>
              <div className="flex items-start">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-primary mt-1 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <p>Vans spacieux pour 8 passagers avec bagages</p>
              </div>
              <div className="flex items-start">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-primary mt-1 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <p>Service 24h/24 et 7j/7 vers tous les aéroports</p>
              </div>
              <div className="flex items-start">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-primary mt-1 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <p>Entreprise familiale avec milliers de trajets réussis</p>
              </div>
            </div>
          </div>
          
          <BookingForm />
          
          <div className="mt-8 bg-gray-100 rounded-lg p-6">
            <h2 className="text-xl font-semibold mb-4">Informations importantes sur votre navette</h2>
            <div className="space-y-3">

              <div className="flex items-start">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-primary mt-1 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <p>Pour les vols internationaux, nous vous recommandons d'arriver à l'aéroport au moins 3 heures avant l'heure de décollage.</p>
              </div>
              <div className="flex items-start">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-primary mt-1 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <p>Pour les vols intérieurs ou Schengen, nous vous conseillons une arrivée 2 heures avant le décollage.</p>
              </div>
              <div className="flex items-start">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-primary mt-1 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <p>Le paiement s'effectue directement auprès du chauffeur par espèces ou carte bancaire.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Booking