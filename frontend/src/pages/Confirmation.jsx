import { useState, useEffect } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { useBooking } from '../contexts/BookingContext'

const Confirmation = () => {
  const { bookingData, priceCalculated, resetBookingData, TRIP_TYPES } = useBooking()
  const navigate = useNavigate()
  const location = useLocation()
  const [localData, setLocalData] = useState(null)
  
  // Utiliser les données stockées dans localStorage ou du contexte
  useEffect(() => {
    console.log("Composant Confirmation monté");
    // Vérifier s'il y a des données dans le localStorage
    const storedData = localStorage.getItem('confirmationData')
    
    if (storedData) {
      // Utiliser les données du localStorage si disponibles
      console.log("Données trouvées dans localStorage");
      setLocalData(JSON.parse(storedData))
      // Supprimer les données après les avoir récupérées
      localStorage.removeItem('confirmationData')
    } else if (!priceCalculated || !bookingData.firstName) {
      console.log("Pas de données dans localStorage ni dans le contexte, redirection");
      navigate('/')
    }
    
    // Nettoyer les données seulement à la sortie, pas au montage
    return () => {
      console.log("Nettoyage au démontage du composant");
      resetBookingData();
    }
  }, []); // Dépendances vides pour n'exécuter qu'au montage
  
  // Utiliser les données locales ou celles du contexte
  const data = localData || bookingData
  
  // Ne rien afficher pendant la redirection ou si les données ne sont pas disponibles
  if ((!priceCalculated && !localData) || (!data.firstName)) {
    return null
  }

  // Calculer le prix par trajet (pour l'aller-retour)
  const pricePerTrip = data.tripType === TRIP_TYPES.ROUND_TRIP 
    ? data.calculatedPrice / 2 
    : data.calculatedPrice
  
  // Adapter l'affichage selon le type de trajet
  const tripTypeText = 
    data.tripType === TRIP_TYPES.OUTBOUND ? "Aller simple" :
    data.tripType === TRIP_TYPES.INBOUND ? "Retour simple" : "Aller-retour"

  // Formater les dates pour l'affichage
  const formatDate = (date) => {
    if (!date) return 'Non spécifiée'
    
    // Si c'est déjà une chaîne (depuis localStorage), la retourner telle quelle
    if (typeof date === 'string') return date
    
    // Sinon, formater l'objet Date
    return date.toLocaleDateString('fr-FR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    })
  }

  return (
    <div className="py-12 bg-gray-50">
      <div className="container-custom">
        <div className="max-w-4xl mx-auto">
          {/* En-tête avec confirmation */}
          <div className="bg-white rounded-t-lg shadow-lg p-8 border-b-4 border-purple-600">
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-20 h-20 bg-purple-600 rounded-full mb-6">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h1 className="text-4xl font-bold text-gray-800 mb-4">Navette aéroport réservée avec succès !</h1>
              <p className="text-xl text-gray-600 mb-2">
                Merci pour votre demande de navette aéroport, <span className="font-semibold">{data.firstName} {data.lastName}</span>.
              </p>
              <p className="text-lg text-gray-600">
                Dès que votre réservation de navette sera traitée, notre équipe familiale vous enverra un mail de confirmation à l'adresse <span className="font-semibold">{data.email}</span>.
              </p>
              <div className="mt-6 inline-block px-6 py-3 bg-purple-100 rounded-lg">
                <span className="text-purple-800 font-semibold">Référence de réservation:</span> {Math.random().toString(36).substring(2, 10).toUpperCase()}
              </div>
            </div>
          </div>
          
          {/* Corps de la confirmation avec toutes les infos */}
          <div className="bg-white shadow-lg mb-6">
            {/* Informations personnelles */}
            <div className="p-8 border-b border-gray-200">
              <h2 className="text-2xl font-bold text-purple-700 mb-6">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 inline-block mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
                Informations personnelles
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-gray-50 p-4 rounded-lg shadow-sm">
                  <h3 className="text-lg font-medium text-gray-700 mb-3">Coordonnées</h3>
                  <div className="space-y-2">
                    <p className="flex justify-between">
                      <span className="text-gray-500">Nom complet:</span>
                      <span className="font-medium">{data.firstName} {data.lastName}</span>
                    </p>
                    <p className="flex justify-between">
                      <span className="text-gray-500">Email:</span>
                      <span className="font-medium">{data.email}</span>
                    </p>
                    <p className="flex justify-between">
                      <span className="text-gray-500">Téléphone:</span>
                      <span className="font-medium">{data.phone}</span>
                    </p>
                  </div>
                </div>
                
                <div className="bg-gray-50 p-4 rounded-lg shadow-sm">
                  <h3 className="text-lg font-medium text-gray-700 mb-3">Adresse de prise en charge</h3>
                  <div className="space-y-2">
                    <p className="flex justify-between">
                      <span className="text-gray-500">Rue et numéro:</span>
                      <span className="font-medium">{data.street} {data.houseNumber}</span>
                    </p>
                    <p className="flex justify-between">
                      <span className="text-gray-500">Code postal:</span>
                      <span className="font-medium">{data.postalCode}</span>
                    </p>
                    <p className="flex justify-between">
                      <span className="text-gray-500">Commune:</span>
                      <span className="font-medium">{data.city}</span>
                    </p>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Récapitulatif du voyage */}
            <div className="p-8 border-b border-gray-200 bg-gray-50">
              <h2 className="text-2xl font-bold text-purple-700 mb-6">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 inline-block mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
                Récapitulatif de votre navette aéroport
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-white p-4 rounded-lg shadow-sm">
                  <h3 className="text-lg font-medium text-gray-700 mb-3">Détails de la navette</h3>
                  <div className="space-y-2">
                    <p className="flex justify-between">
                      <span className="text-gray-500">Type de navette:</span>
                      <span className="font-medium">{tripTypeText}</span>
                    </p>
                    <p className="flex justify-between">
                      <span className="text-gray-500">Destination:</span>
                      <span className="font-medium">{data.airport}</span>
                    </p>
                    <p className="flex justify-between">
                      <span className="text-gray-500">Nombre de passagers:</span>
                      <span className="font-medium">{data.passengers}</span>
                    </p>
                    <p className="flex justify-between">
                      <span className="text-gray-500">Nombre de bagages:</span>
                      <span className="font-medium">{data.luggage}</span>
                    </p>
                    {data.childSeats > 0 && (
                      <p className="flex justify-between">
                        <span className="text-gray-500">Sièges enfant:</span>
                        <span className="font-medium">{data.childSeats}</span>
                      </p>
                    )}
                    {data.boosters > 0 && (
                      <p className="flex justify-between">
                        <span className="text-gray-500">Réhausseurs:</span>
                        <span className="font-medium">{data.boosters}</span>
                      </p>
                    )}
                    {data.remarks && (
                      <p className="flex flex-col mt-3">
                        <span className="text-gray-500 mb-1">Remarques:</span>
                        <span className="font-medium bg-gray-50 p-2 rounded-md">{data.remarks}</span>
                      </p>
                    )}
                  </div>
                </div>
                
                <div className="bg-white p-4 rounded-lg shadow-sm">
                  <h3 className="text-lg font-medium text-gray-700 mb-3">Tarification de votre navette</h3>
                  <div className="space-y-3">
                    {data.tripType === TRIP_TYPES.ROUND_TRIP ? (
                      <>
                        <p className="flex justify-between">
                          <span className="text-gray-500">Navette aller (Domicile → {data.airport}):</span>
                          <span className="font-medium">{pricePerTrip.toFixed(2)}€</span>
                        </p>
                        <p className="flex justify-between">
                          <span className="text-gray-500">Navette retour ({data.airport} → Domicile):</span>
                          <span className="font-medium">{pricePerTrip.toFixed(2)}€</span>
                        </p>
                      </>
                    ) : (
                      <p className="flex justify-between">
                        <span className="text-gray-500">Navette {data.tripType === TRIP_TYPES.OUTBOUND ? `aller (Domicile → ${data.airport})` : `retour (${data.airport} → Domicile)`}:</span>
                        <span className="font-medium">{pricePerTrip.toFixed(2)}€</span>
                      </p>
                    )}
                    
                    <div className="border-t border-gray-200 pt-2 mt-2">
                      <p className="flex justify-between font-bold text-lg">
                        <span>Prix total de votre navette:</span>
                        <span className="text-black">{data.calculatedPrice.toFixed(2)}€</span>
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Détails du trajet aller */}
            {(data.tripType === TRIP_TYPES.OUTBOUND || data.tripType === TRIP_TYPES.ROUND_TRIP) && (
              <div className="p-8 border-b border-gray-200">
                <h2 className="text-2xl font-bold text-purple-700 mb-6">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 inline-block mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                  </svg>
                  Navette aller - Domicile vers {data.airport}
                </h2>
                
                <div className="bg-gray-50 p-6 rounded-lg shadow-sm">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-700 mb-3">Date et heure de départ</h3>
                      <div className="space-y-3">
                        <p className="flex justify-between">
                          <span className="text-gray-500">Date:</span>
                          <span className="font-medium">{formatDate(data.departureDate)}</span>
                        </p>
                        <p className="flex justify-between">
                          <span className="text-gray-500">Heure:</span>
                          <span className="font-medium">{data.departureTime}</span>
                        </p>
                      </div>
                    </div>
                    
                    <div>
                      <h3 className="text-lg font-semibold text-gray-700 mb-3">Détails du trajet aller</h3>
                      <div className="space-y-3">
                        <p className="flex justify-between">
                          <span className="text-gray-500">Lieu de départ:</span>
                          <span className="font-medium">{data.street} {data.houseNumber}</span>
                        </p>
                        <p className="flex justify-between">
                          <span className="text-gray-500">Localité:</span>
                          <span className="font-medium">{data.postalCode} {data.city}</span>
                        </p>
                        <p className="flex justify-between">
                          <span className="text-gray-500">Destination:</span>
                          <span className="font-medium">{data.airport}</span>
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
            
            {/* Détails du trajet retour */}
            {(data.tripType === TRIP_TYPES.INBOUND || data.tripType === TRIP_TYPES.ROUND_TRIP) && (
              <div className="p-8 border-b border-gray-200">
                <h2 className="text-2xl font-bold text-purple-700 mb-6">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 inline-block mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 17l-4 4m0 0l-4-4m4 4V3" />
                  </svg>
                  Navette retour - {data.airport} vers Domicile
                </h2>
                
                <div className="bg-gray-50 p-6 rounded-lg shadow-sm">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-700 mb-3">Date et heure d'arrivée</h3>
                      <div className="space-y-3">
                        <p className="flex justify-between">
                          <span className="text-gray-500">Date:</span>
                          <span className="font-medium">{formatDate(data.arrivalDate)}</span>
                        </p>
                        <p className="flex justify-between">
                          <span className="text-gray-500">Heure:</span>
                          <span className="font-medium">{data.arrivalTime}</span>
                        </p>
                      </div>
                    </div>
                    
                    <div>
                      <h3 className="text-lg font-semibold text-gray-700 mb-3">Détails du vol</h3>
                      <div className="space-y-3">
                        <p className="flex justify-between">
                          <span className="text-gray-500">Numéro de vol:</span>
                          <span className="font-medium">{data.flightNumber}</span>
                        </p>
                        {data.flightOrigin && (
                          <p className="flex justify-between">
                            <span className="text-gray-500">Provenance:</span>
                            <span className="font-medium">{data.flightOrigin}</span>
                          </p>
                        )}
                        <p className="flex justify-between">
                          <span className="text-gray-500">Destination finale:</span>
                          <span className="font-medium">{data.street} {data.houseNumber}, {data.postalCode} {data.city}</span>
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
            
            {/* Informations importantes */}
            <div className="p-8 bg-purple-50">
              <h2 className="text-2xl font-bold text-purple-700 mb-6">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 inline-block mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Informations importantes sur votre navette aéroport
              </h2>
              
              <div className="bg-white p-6 rounded-lg shadow-sm space-y-4">
                <div className="flex items-start space-x-3">
                  <div className="flex-shrink-0 mt-1">
                    <svg className="h-5 w-5 text-purple-700" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <p>Notre chauffeur vous contactera un jour avant votre départ pour confirmer les détails de votre navette.</p>
                </div>
                
                <div className="flex items-start space-x-3">
                  <div className="flex-shrink-0 mt-1">
                    <svg className="h-5 w-5 text-purple-700" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <p>Notre van 8 places vous permet de voyager confortablement avec tous vos bagages vers l'aéroport de votre choix.</p>
                </div>
                
                <div className="flex items-start space-x-3">
                  <div className="flex-shrink-0 mt-1">
                    <svg className="h-5 w-5 text-purple-700" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <p>Pour toute modification de votre réservation de navette, veuillez nous contacter au moins 24 heures à l'avance.</p>
                </div>
                
                <div className="flex items-start space-x-3">
                  <div className="flex-shrink-0 mt-1">
                    <svg className="h-5 w-5 text-purple-700" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <p>Le paiement de votre navette s'effectue directement auprès du chauffeur par espèces ou carte de crédit.</p>
                </div>
              </div>
            </div>
          </div>
          
          {/* Actions */}
          <div className="bg-white rounded-b-lg shadow-lg p-8">
            <div className="text-center">
              <p className="mb-6 text-gray-600">
                Notre équipe a reçu votre demande et vous contactera bientôt pour confirmer les détails.
                Pour toute question concernant votre navette, n'hésitez pas à nous contacter.
              </p>
              
              <div className="flex flex-col sm:flex-row justify-center gap-4">
                <Link to="/" className="btn-primary px-8 py-3">
                  Retour à l'accueil
                </Link>
                <Link to="/contact" className="btn-outline px-8 py-3">
                  Nous contacter
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Confirmation