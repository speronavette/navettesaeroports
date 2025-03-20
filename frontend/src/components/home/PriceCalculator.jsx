import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useBooking } from '../../contexts/BookingContext'
import Papa from 'papaparse'
// Ajout pour la persistance des données
const LOCAL_STORAGE_KEY = 'navette-price-calculator-data'

const PriceCalculator = () => {
  const {
    updateBookingData,
    TRIP_TYPES,
    AIRPORTS
  } = useBooking()
  
  // Initialiser avec les valeurs stockées dans localStorage s'il y en a
  const savedData = JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEY) || '{}')
  
  const [postalCode, setPostalCode] = useState(savedData.postalCode || "")
  const [airport, setAirport] = useState(savedData.airport || AIRPORTS[0])
  const [passengers, setPassengers] = useState(savedData.passengers || 1)
  const [tripType, setTripType] = useState(savedData.tripType || TRIP_TYPES.OUTBOUND) // On garde cette variable même si elle n'est plus modifiable dans l'UI
  const [error, setError] = useState('')
  const [calculatedPrice, setCalculatedPrice] = useState(null)
  const [pricesData, setPricesData] = useState([])
  const [loadingPrices, setLoadingPrices] = useState(true)
  
  const navigate = useNavigate()
  
  // Charger les données de prix au démarrage du composant
  useEffect(() => {
    const loadPriceData = async () => {
      try {
        setLoadingPrices(true);
        const response = await fetch('/data/prices.csv');
        if (!response.ok) {
          console.error('Impossible de charger le fichier de prix');
          setLoadingPrices(false);
          return;
        }
        
        const csvText = await response.text();
        
        Papa.parse(csvText, {
          header: true,
          skipEmptyLines: true,
          complete: (results) => {
            if (results.errors.length > 0) {
              console.error('Erreurs d\'analyse CSV:', results.errors);
            }
            setPricesData(results.data);
            setLoadingPrices(false);
          },
          error: (error) => {
            console.error('Erreur lors de l\'analyse du CSV:', error);
            setLoadingPrices(false);
          }
        });
      } catch (error) {
        console.error('Erreur lors du chargement des prix:', error);
        setLoadingPrices(false);
      }
    };
    
    loadPriceData();
  }, []);

  // Fonction pour calculer le prix en utilisant les données de prix chargées
  const calculatePrice = () => {
    if (!postalCode || !airport || !passengers || pricesData.length === 0) {
      return null; // Retourner null si données incomplètes ou prix non chargés
    }
    
    // Rechercher la correspondance dans les données chargées
    const priceEntry = pricesData.find(
      entry => entry.postalCode === postalCode && entry.airport === airport
    );
    
    // Si aucune correspondance n'est trouvée, retourner null
    if (!priceEntry) {
      return null;
    }
    
    // Récupérer le prix de base depuis les données
    let basePrice = parseFloat(priceEntry.price);
    if (isNaN(basePrice)) {
      return null; // Si le prix n'est pas un nombre valide
    }
    
    // Calcul du supplément en fonction du nombre de passagers
    let additionalFee = 0;
    // S'assurer que passengers est bien un nombre
    const passengersNumber = parseInt(passengers) || 1;
    
    switch(passengersNumber) {
      case 3: additionalFee = 5; break;
      case 4: additionalFee = 10; break;
      case 5: additionalFee = 15; break;
      case 6: additionalFee = 20; break;
      case 7: additionalFee = 25; break;
      case 8: additionalFee = 30; break;
      default: additionalFee = 0; // Pour 1-2 personnes
    }
    
    let price = basePrice + additionalFee;
    
    // Si c'est un aller-retour, doubler le prix (conservé pour la logique sous-jacente)
    if (tripType === TRIP_TYPES.ROUND_TRIP) {
      price = price * 2;
    }
    
    return price;
  }

  // Calculer le prix à chaque changement de paramètre
  useEffect(() => {
    if (postalCode && !loadingPrices) {
      const price = calculatePrice();
      setCalculatedPrice(price);
      setError('');
      
      // Sauvegarder les données actuelles dans localStorage
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify({
        postalCode,
        airport,
        passengers,
        tripType
      }));
    } else {
      setCalculatedPrice(null);
    }
  }, [postalCode, airport, passengers, tripType, loadingPrices, pricesData]);

  const handleSubmit = (e) => {
    e.preventDefault() // Empêche le comportement par défaut de soumission du formulaire
    
    if (!postalCode) {
      setError('Veuillez renseigner votre code postal')
      return
    }
    
    if (calculatedPrice === null) {
      setError('Ce trajet n\'est pas disponible. Veuillez choisir une autre destination ou un autre code postal.')
      return;
    }
    
    // Mise à jour des données de réservation dans le contexte
    updateBookingData({
      postalCode,
      airport,
      passengers: parseInt(passengers),
      tripType
    })
    
    // Redirection vers la page de réservation
    navigate('/booking')
  }

  return (
    <div className="bg-white shadow-lg rounded-lg p-6 mb-6">
      <h2 className="text-2xl font-bold text-center mb-4">Réservez votre navette aéroport</h2>
      
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}
      
      {loadingPrices ? (
        <div className="text-center py-4">
          <p>Chargement des tarifs...</p>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="postalCode" className="block text-sm font-medium text-gray-700 mb-1">
              Code postal de départ
            </label>
            <input
              type="text"
              id="postalCode"
              className="input-field"
              value={postalCode}
              onChange={(e) => setPostalCode(e.target.value)}
              placeholder="Entrez votre code postal"
              required
            />
          </div>
          
          <div>
            <label htmlFor="airport" className="block text-sm font-medium text-gray-700 mb-1">
              Aéroport / Gare
            </label>
            <select
              id="airport"
              className="input-field"
              value={airport}
              onChange={(e) => setAirport(e.target.value)}
              required
            >
              {AIRPORTS.map((airportName) => (
                <option key={airportName} value={airportName}>
                  {airportName}
                </option>
              ))}
            </select>
          </div>
          
          <div>
            <label htmlFor="passengers" className="block text-sm font-medium text-gray-700 mb-1">
              Nombre de passagers
            </label>
            <select
              id="passengers"
              className="input-field"
              value={passengers}
              onChange={(e) => setPassengers(e.target.value)}
              required
            >
              {[...Array(8)].map((_, i) => (
                <option key={i + 1} value={i + 1}>
                  {i + 1} {i === 0 ? 'passager' : 'passagers'}
                </option>
              ))}
            </select>
          </div>
          
          <div className="pt-2">
            <div className="mb-4 p-4 bg-gray-50 rounded-lg border border-gray-200">
              {!postalCode ? (
                <p className="text-lg text-gray-500 text-center">Veuillez renseigner votre code postal</p>
              ) : calculatedPrice === null ? (
                <p className="text-lg text-gray-500 text-center">Code postal ou destination non desservi</p>
              ) : (
                <>
                  <p className="text-lg font-medium mb-1">Prix estimé pour votre trajet:</p>
                  <p className="text-2xl font-bold text-primary">{calculatedPrice.toFixed(2)} € par trajet</p>
                </>
              )}
            </div>
            
            <button 
              type="button" 
              onClick={handleSubmit}
              className={`btn-primary w-full ${!postalCode || calculatedPrice === null ? 'opacity-50 cursor-not-allowed' : ''}`}
              disabled={!postalCode || calculatedPrice === null}
            >
              Réserver maintenant
            </button>
          </div>
        </form>
      )}
    </div>
  )
}

export default PriceCalculator