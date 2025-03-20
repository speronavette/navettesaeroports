import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useBooking, TRIP_TYPES, AIRPORTS } from '../../contexts/BookingContext'
import DatePicker from 'react-datepicker'
import "react-datepicker/dist/react-datepicker.css"
import { fr } from 'date-fns/locale'
import axios from 'axios'

const BookingForm = () => {
  const { bookingData, updateBookingData, priceCalculated, resetBookingData, TRIP_TYPES, AIRPORTS } = useBooking()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [formErrors, setFormErrors] = useState({})
  const navigate = useNavigate()
  
  // Vérifier si le prix a été calculé
  useEffect(() => {
    if (!priceCalculated) {
      navigate('/')
    }
  }, [priceCalculated, navigate])

  const validateForm = () => {
    const errors = {}

    // Vérification des champs obligatoires
    const requiredFields = [
      'firstName', 'lastName', 'phone', 'email', 'street', 
      'houseNumber', 'postalCode', 'city', 'departureDate', 'departureTime'
    ]

    requiredFields.forEach(field => {
      if (!bookingData[field]) {
        errors[field] = 'Ce champ est obligatoire'
      }
    })

    // Vérification de l'email
    if (bookingData.email && !/^\S+@\S+\.\S+$/.test(bookingData.email)) {
      errors.email = 'Adresse email invalide'
    }

    // Vérifications pour le voyage retour
    if (bookingData.tripType === TRIP_TYPES.ROUND_TRIP || bookingData.tripType === TRIP_TYPES.INBOUND) {
      if (!bookingData.arrivalDate) {
        errors.arrivalDate = 'Date d\'arrivée obligatoire'
      }
      if (!bookingData.arrivalTime) {
        errors.arrivalTime = 'Heure d\'arrivée obligatoire'
      }
      if (!bookingData.flightNumber) {
        errors.flightNumber = 'Numéro de vol obligatoire'
      }
    }

    setFormErrors(errors)
    return Object.keys(errors).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    console.log("Formulaire soumis");
    
    if (!validateForm()) {
      console.log("Validation échouée");
      return;
    }
    
    setIsSubmitting(true)
    setFormErrors({}) // Réinitialiser les erreurs
    
    try {
      // Préparer les données de réservation (pour éviter les problèmes avec les objets Date)
      const bookingDataToSend = {
        ...bookingData,
        // S'assurer que les dates sont formatées correctement
        departureDate: bookingData.departureDate ? bookingData.departureDate.toISOString() : null,
        arrivalDate: bookingData.arrivalDate ? bookingData.arrivalDate.toISOString() : null
      };
      
      // Envoi direct de la demande (sans passer par emailService)
      console.log("Envoi de la demande de réservation...");
      const response = await axios.post(`${import.meta.env.VITE_SERVER_URL}/api/booking`, bookingDataToSend, {
        timeout: 15000, // Augmenter le timeout à 15 secondes
        headers: {
          'Content-Type': 'application/json'
        }
      });
      
      console.log("Réservation enregistrée avec succès:", response.data);
      
      // Stocker les données dans localStorage (pour la page de confirmation)
      const dataToStore = {
        ...bookingData,
        departureDate: bookingData.departureDate ? bookingData.departureDate.toLocaleDateString('fr-FR') : null,
        arrivalDate: bookingData.arrivalDate ? bookingData.arrivalDate.toLocaleDateString('fr-FR') : null
      };
      
      console.log("Stockage des données dans localStorage");
      localStorage.setItem('confirmationData', JSON.stringify(dataToStore));
      
      // Ajout important : forcer priceCalculated à true
      // pour éviter une redirection immédiate lors du chargement de la page confirmation
      updateBookingData({ forceCalc: true });
      
      console.log("Redirection vers confirmation");
      navigate('/confirmation', { state: { fromBooking: true }});
    } catch (error) {
      console.error('Erreur lors de la soumission du formulaire:', error);
      
      // Message d'erreur plus convivial pour l'utilisateur
      let errorMessage = 'Une erreur est survenue lors de l\'envoi de votre demande.';
      
      if (error.response && error.response.data && error.response.data.error) {
        console.error('Détail de l\'erreur:', error.response.data);
        errorMessage += ` Veuillez réessayer plus tard ou nous contacter directement.`;
      } else if (error.message) {
        errorMessage += ` Détail: ${error.message}`;
      }
      
      setFormErrors({
        submit: errorMessage
      });
      
      // Afficher une alerte pour l'administrateur en développement
      if (import.meta.env.DEV) {
        console.log('Détail de l\'erreur pour le développeur:', error);
      }
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleInputChange = (e) => {
    const { name, value, type } = e.target
    
    // Conversion des valeurs numériques
    const parsedValue = type === 'number' ? parseInt(value) : value
    
    updateBookingData({ [name]: parsedValue })
    
    // Effacer l'erreur pour ce champ
    if (formErrors[name]) {
      setFormErrors(prev => {
        const updated = { ...prev }
        delete updated[name]
        return updated
      })
    }
  }

  const handleDateChange = (date, fieldName) => {
    updateBookingData({ [fieldName]: date })
    
    // Effacer l'erreur pour ce champ
    if (formErrors[fieldName]) {
      setFormErrors(prev => {
        const updated = { ...prev }
        delete updated[fieldName]
        return updated
      })
    }
  }

  const handleTripTypeChange = (newTripType) => {
    updateBookingData({ tripType: newTripType })
  }

  // Calcul du prix par trajet (pour afficher le détail aller/retour)
  const getPricePerTrip = () => {
    if (bookingData.tripType === TRIP_TYPES.ROUND_TRIP) {
      return bookingData.calculatedPrice / 2;
    }
    return bookingData.calculatedPrice;
  }

  // Si redirection en cours, ne rien afficher
  if (!priceCalculated || !bookingData.postalCode) {
    return null
  }

  return (
    <div className="bg-white shadow-lg rounded-lg p-6 mb-6">
      <h2 className="text-2xl font-bold mb-4">Réservation de votre navette</h2>
      
      {formErrors.submit && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {formErrors.submit}
        </div>
      )}
      
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Informations personnelles */}
        <div>
          <h3 className="text-lg font-semibold mb-3">Informations personnelles</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="form-group">
              <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 mb-1">
                Prénom*
              </label>
              <input
                type="text"
                id="firstName"
                name="firstName"
                value={bookingData.firstName}
                onChange={handleInputChange}
                className={`input-field ${formErrors.firstName ? 'border-red-500' : ''}`}
              />
              {formErrors.firstName && (
                <p className="text-red-500 text-xs mt-1">{formErrors.firstName}</p>
              )}
            </div>
            
            <div className="form-group">
              <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 mb-1">
                Nom*
              </label>
              <input
                type="text"
                id="lastName"
                name="lastName"
                value={bookingData.lastName}
                onChange={handleInputChange}
                className={`input-field ${formErrors.lastName ? 'border-red-500' : ''}`}
              />
              {formErrors.lastName && (
                <p className="text-red-500 text-xs mt-1">{formErrors.lastName}</p>
              )}
            </div>
            
            <div className="form-group">
              <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
                Téléphone*
              </label>
              <input
                type="tel"
                id="phone"
                name="phone"
                value={bookingData.phone}
                onChange={handleInputChange}
                className={`input-field ${formErrors.phone ? 'border-red-500' : ''}`}
              />
              {formErrors.phone && (
                <p className="text-red-500 text-xs mt-1">{formErrors.phone}</p>
              )}
            </div>
            
            <div className="form-group">
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                Email*
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={bookingData.email}
                onChange={handleInputChange}
                className={`input-field ${formErrors.email ? 'border-red-500' : ''}`}
              />
              {formErrors.email && (
                <p className="text-red-500 text-xs mt-1">{formErrors.email}</p>
              )}
            </div>
          </div>
        </div>
        
        {/* Adresse */}
        <div>
          <h3 className="text-lg font-semibold mb-3">Adresse</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="form-group md:col-span-2">
              <label htmlFor="street" className="block text-sm font-medium text-gray-700 mb-1">
                Rue*
              </label>
              <input
                type="text"
                id="street"
                name="street"
                value={bookingData.street}
                onChange={handleInputChange}
                className={`input-field ${formErrors.street ? 'border-red-500' : ''}`}
              />
              {formErrors.street && (
                <p className="text-red-500 text-xs mt-1">{formErrors.street}</p>
              )}
            </div>
            
            <div className="form-group">
              <label htmlFor="houseNumber" className="block text-sm font-medium text-gray-700 mb-1">
                Numéro*
              </label>
              <input
                type="text"
                id="houseNumber"
                name="houseNumber"
                value={bookingData.houseNumber}
                onChange={handleInputChange}
                className={`input-field ${formErrors.houseNumber ? 'border-red-500' : ''}`}
              />
              {formErrors.houseNumber && (
                <p className="text-red-500 text-xs mt-1">{formErrors.houseNumber}</p>
              )}
            </div>
            
            <div className="form-group">
              <label htmlFor="postalCode" className="block text-sm font-medium text-gray-700 mb-1">
                Code postal*
              </label>
              <input
                type="text"
                id="postalCode"
                name="postalCode"
                value={bookingData.postalCode}
                onChange={handleInputChange}
                className={`input-field ${formErrors.postalCode ? 'border-red-500' : ''}`}
              />
              {formErrors.postalCode && (
                <p className="text-red-500 text-xs mt-1">{formErrors.postalCode}</p>
              )}
            </div>
            
            <div className="form-group">
              <label htmlFor="city" className="block text-sm font-medium text-gray-700 mb-1">
                Commune*
              </label>
              <input
                type="text"
                id="city"
                name="city"
                value={bookingData.city}
                onChange={handleInputChange}
                className={`input-field ${formErrors.city ? 'border-red-500' : ''}`}
              />
              {formErrors.city && (
                <p className="text-red-500 text-xs mt-1">{formErrors.city}</p>
              )}
            </div>
          </div>
        </div>
        
        {/* Détails du voyage */}
        <div>
          <h3 className="text-lg font-semibold mb-3">Détails du voyage</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="form-group">
              <label htmlFor="passengers" className="block text-sm font-medium text-gray-700 mb-1">
                Nombre de passagers*
              </label>
              <select
                id="passengers"
                name="passengers"
                value={bookingData.passengers}
                onChange={handleInputChange}
                className="input-field"
              >
                {[...Array(8)].map((_, i) => (
                  <option key={i + 1} value={i + 1}>
                    {i + 1} {i === 0 ? 'passager' : 'passagers'}
                  </option>
                ))}
              </select>
            </div>
            
            <div className="form-group">
              <label htmlFor="luggage" className="block text-sm font-medium text-gray-700 mb-1">
                Nombre de bagages*
              </label>
              <select
                id="luggage"
                name="luggage"
                value={bookingData.luggage}
                onChange={handleInputChange}
                className="input-field"
              >
                {[...Array(20)].map((_, i) => (
                  <option key={i} value={i}>
                    {i} {i <= 1 ? 'bagage' : 'bagages'}
                  </option>
                ))}
              </select>
            </div>
            
            <div className="form-group">
              <label htmlFor="childSeats" className="block text-sm font-medium text-gray-700 mb-1">
                Sièges enfant
              </label>
              <select
                id="childSeats"
                name="childSeats"
                value={bookingData.childSeats}
                onChange={handleInputChange}
                className="input-field"
              >
                {[...Array(3)].map((_, i) => (
                  <option key={i} value={i}>{i}</option>
                ))}
              </select>
            </div>
            
            <div className="form-group">
              <label htmlFor="boosters" className="block text-sm font-medium text-gray-700 mb-1">
                Réhausseurs
              </label>
              <select
                id="boosters"
                name="boosters"
                value={bookingData.boosters}
                onChange={handleInputChange}
                className="input-field"
              >
                {[...Array(3)].map((_, i) => (
                  <option key={i} value={i}>{i}</option>
                ))}
              </select>
            </div>
            
            <div className="form-group">
              <label htmlFor="airport" className="block text-sm font-medium text-gray-700 mb-1">
                Aéroport / Gare*
              </label>
              <select
                id="airport"
                name="airport"
                value={bookingData.airport}
                onChange={handleInputChange}
                className="input-field"
              >
                {AIRPORTS.map((airportName) => (
                  <option key={airportName} value={airportName}>
                    {airportName}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

                  {/* Champ pour les remarques */}
                  <div className="mt-4">
            <label htmlFor="remarks" className="block text-sm font-medium text-gray-700 mb-1">
              Remarques ou besoins spécifiques
            </label>
            <textarea
              id="remarks"
              name="remarks"
              value={bookingData.remarks}
              onChange={handleInputChange}
              rows="3"
              placeholder="Instructions particulières, besoins spécifiques, etc."
              className="input-field w-full"
            ></textarea>
          </div>
        
        {/* Type de trajet - MODIFIÉ POUR UTILISER DES BOUTONS AU LIEU DES BOUTONS RADIO */}
        <div>
          <h3 className="text-lg font-semibold mb-3">Type de trajet</h3>
          <div className="grid grid-cols-3 gap-4">
            <button 
              type="button"
              onClick={() => handleTripTypeChange(TRIP_TYPES.OUTBOUND)}
              className={`py-2 px-4 rounded-md transition-colors duration-200 w-full ${
                bookingData.tripType === TRIP_TYPES.OUTBOUND 
                  ? 'bg-purple-600 text-white' 
                  : 'bg-purple-200 text-purple-800 hover:bg-purple-300'
              }`}
            >
              Aller simple
            </button>
            
            <button 
              type="button"
              onClick={() => handleTripTypeChange(TRIP_TYPES.INBOUND)}
              className={`py-2 px-4 rounded-md transition-colors duration-200 w-full ${
                bookingData.tripType === TRIP_TYPES.INBOUND 
                  ? 'bg-purple-600 text-white' 
                  : 'bg-purple-200 text-purple-800 hover:bg-purple-300'
              }`}
            >
              Retour simple
            </button>
            
            <button 
              type="button"
              onClick={() => handleTripTypeChange(TRIP_TYPES.ROUND_TRIP)}
              className={`py-2 px-4 rounded-md transition-colors duration-200 w-full ${
                bookingData.tripType === TRIP_TYPES.ROUND_TRIP 
                  ? 'bg-purple-600 text-white' 
                  : 'bg-purple-200 text-purple-800 hover:bg-purple-300'
              }`}
            >
              Aller-retour
            </button>
          </div>
        </div>
        
        {/* Détails du trajet aller (visible pour aller simple ou aller-retour) */}
        {(bookingData.tripType === TRIP_TYPES.OUTBOUND || bookingData.tripType === TRIP_TYPES.ROUND_TRIP) && (
          <div>
            <h3 className="text-lg font-semibold mb-3">Trajet aller (vers l'aéroport)</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="form-group">
                <label htmlFor="departureDate" className="block text-sm font-medium text-gray-700 mb-1">
                  Date du départ*
                </label>
                <DatePicker
                  selected={bookingData.departureDate}
                  onChange={(date) => handleDateChange(date, 'departureDate')}
                  dateFormat="dd/MM/yyyy"
                  minDate={new Date()}
                  locale={fr}
                  className={`input-field w-full ${formErrors.departureDate ? 'border-red-500' : ''}`}
                />
                {formErrors.departureDate && (
                  <p className="text-red-500 text-xs mt-1">{formErrors.departureDate}</p>
                )}
              </div>
              
              <div className="form-group">
                <label htmlFor="departureTime" className="block text-sm font-medium text-gray-700 mb-1">
                  Heure de départ*
                </label>
                <input
                  type="time"
                  id="departureTime"
                  name="departureTime"
                  value={bookingData.departureTime}
                  onChange={handleInputChange}
                  className={`input-field ${formErrors.departureTime ? 'border-red-500' : ''}`}
                />
                {formErrors.departureTime && (
                  <p className="text-red-500 text-xs mt-1">{formErrors.departureTime}</p>
                )}
              </div>
            </div>
          </div>
        )}
        
        {/* Détails du trajet retour (visible pour retour simple ou aller-retour) */}
        {(bookingData.tripType === TRIP_TYPES.INBOUND || bookingData.tripType === TRIP_TYPES.ROUND_TRIP) && (
          <div>
            <h3 className="text-lg font-semibold mb-3">
              {bookingData.tripType === TRIP_TYPES.INBOUND ? 'Trajet retour (depuis l\'aéroport)' : 'Trajet retour (depuis l\'aéroport)'}
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="form-group">
                <label htmlFor="arrivalDate" className="block text-sm font-medium text-gray-700 mb-1">
                  Date d'arrivée*
                </label>
                <DatePicker
                  selected={bookingData.arrivalDate}
                  onChange={(date) => handleDateChange(date, 'arrivalDate')}
                  dateFormat="dd/MM/yyyy"
                  minDate={bookingData.departureDate || new Date()}
                  locale={fr}
                  className={`input-field w-full ${formErrors.arrivalDate ? 'border-red-500' : ''}`}
                />
                {formErrors.arrivalDate && (
                  <p className="text-red-500 text-xs mt-1">{formErrors.arrivalDate}</p>
                )}
              </div>
              
              <div className="form-group">
                <label htmlFor="arrivalTime" className="block text-sm font-medium text-gray-700 mb-1">
                  Heure d'arrivée*
                </label>
                <input
                  type="time"
                  id="arrivalTime"
                  name="arrivalTime"
                  value={bookingData.arrivalTime}
                  onChange={handleInputChange}
                  className={`input-field ${formErrors.arrivalTime ? 'border-red-500' : ''}`}
                />
                {formErrors.arrivalTime && (
                  <p className="text-red-500 text-xs mt-1">{formErrors.arrivalTime}</p>
                )}
              </div>
              
              <div className="form-group">
                <label htmlFor="flightNumber" className="block text-sm font-medium text-gray-700 mb-1">
                  Numéro de vol*
                </label>
                <input
                  type="text"
                  id="flightNumber"
                  name="flightNumber"
                  value={bookingData.flightNumber}
                  onChange={handleInputChange}
                  className={`input-field ${formErrors.flightNumber ? 'border-red-500' : ''}`}
                />
                {formErrors.flightNumber && (
                  <p className="text-red-500 text-xs mt-1">{formErrors.flightNumber}</p>
                )}
              </div>
              
              <div className="form-group">
                <label htmlFor="flightOrigin" className="block text-sm font-medium text-gray-700 mb-1">
                  Provenance du vol
                </label>
                <input
                  type="text"
                  id="flightOrigin"
                  name="flightOrigin"
                  value={bookingData.flightOrigin}
                  onChange={handleInputChange}
                  className="input-field"
                />
              </div>
            </div>
          </div>
        )}
        
        {/* Section résumé du voyage (à la fin du formulaire) */}
        <div className="mt-6 p-4 bg-purple-100 rounded-md">
          <h3 className="text-xl font-semibold mb-2">Résumé de votre trajet</h3>
          <p className="mb-1">
            <span className="font-medium">De:</span> {bookingData.postalCode}
          </p>
          <p className="mb-1">
            <span className="font-medium">Vers:</span> {bookingData.airport}
          </p>
          <p className="mb-1">
            <span className="font-medium">Nombre de passagers:</span> {bookingData.passengers}
          </p>
          <p className="mb-1">
            <span className="font-medium">Type de trajet:</span> {
              bookingData.tripType === TRIP_TYPES.OUTBOUND ? "Aller simple" :
              bookingData.tripType === TRIP_TYPES.INBOUND ? "Retour simple" : "Aller-retour"
            }
          </p>
          
          {/* Détail des prix */}
          {bookingData.tripType === TRIP_TYPES.ROUND_TRIP ? (
            <>
              <div className="flex justify-between text-sm mb-1">
                <span>Trajet aller:</span>
                <span>{getPricePerTrip().toFixed(2)}€</span>
              </div>
              <div className="flex justify-between text-sm mb-2">
                <span>Trajet retour:</span>
                <span>{getPricePerTrip().toFixed(2)}€</span>
              </div>
            </>
          ) : (
            <div className="flex justify-between text-sm mb-2">
              <span>Trajet {bookingData.tripType === TRIP_TYPES.OUTBOUND ? "aller" : "retour"}:</span>
              <span>{getPricePerTrip().toFixed(2)}€</span>
            </div>
          )}
          
          <p className="text-xl font-bold text-black mt-2">
            Prix total: {bookingData.calculatedPrice.toFixed(2)}€
          </p>
        </div>

        <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-6">
  <div className="flex">
    <div className="flex-shrink-0">
      <svg className="h-5 w-5 text-yellow-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
        <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
      </svg>
    </div>
    <div className="ml-3">
      <p className="text-sm text-yellow-800 font-medium">
        IMPORTANT: Un numéro d'appel vous sera communiqué une fois la réservation effectuée.
      </p>
    </div>
  </div>
</div>
        
        <div className="flex justify-between mt-8">
          <button
            type="button"
            onClick={() => navigate('/')}
            className="btn-outline"
          >
            Retour
          </button>
          
          <button
            type="submit"
            className="btn-primary min-w-32"
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Envoi en cours...' : 'Envoyer ma demande'}
          </button>
        </div>
      </form>
    </div>
  )
}

export default BookingForm