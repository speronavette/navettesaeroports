import { createContext, useState, useContext } from 'react'

const BookingContext = createContext()

// Liste prédéfinie des aéroports/gares
export const AIRPORTS = [
  "Aéroport de Charleroi",
  "Aéroport de Bruxelles",
  "Gare de Bruxelles-Midi",
  "Aéroport de Luxembourg",
  "Aéroport d'Amsterdam",
  "Aéroport de Paris Charles de Gaulle",
  "Aéroport de Paris Orly",
  "Aéroport de Lille",
  "Aéroport de Cologne",
  "Aéroport de Liège",
  "Aéroport d'Ostende",
  "Aéroport de Dusseldorf"
]

// Types de trajets
export const TRIP_TYPES = {
  OUTBOUND: 'outbound', // Aller simple
  INBOUND: 'inbound',   // Retour simple
  ROUND_TRIP: 'roundTrip' // Aller-retour
}

export const useBooking = () => {
  const context = useContext(BookingContext)
  if (!context) {
    throw new Error('useBooking doit être utilisé dans un BookingProvider')
  }
  return context
}

export const BookingProvider = ({ children, priceData }) => {
  const [bookingData, setBookingData] = useState({
    // Informations personnelles
    firstName: '',
    lastName: '',
    phone: '',
    email: '',
    street: '',
    houseNumber: '',
    postalCode: '',
    city: '',
    
    // Informations de voyage
    passengers: 1,
    luggage: 1,
    childSeats: 0,
    boosters: 0,
    airport: AIRPORTS[0], // Valeur par défaut: premier aéroport de la liste
    remarks: '',
    
    // Type de trajet
    tripType: TRIP_TYPES.OUTBOUND, // Par défaut: aller simple
    
    // Aller
    departureDate: null,
    departureTime: '',
    
    // Retour
    arrivalDate: null,
    arrivalTime: '',
    flightNumber: '',
    flightOrigin: '',
    
    // Prix calculé
    calculatedPrice: 0,
  })

  const [priceCalculated, setPriceCalculated] = useState(false)

  // Fonction pour calculer le prix selon les paramètres
  const calculatePrice = (postalCode, airport, passengers, tripType) => {
    if (!postalCode || !airport || !passengers) {
      return 0
    }

    // Pour la démo, on utilise un prix fixe si le fichier CSV n'a pas les données
    // Dans un environnement de production, vous voudriez avoir des prix réels pour toutes les combinaisons
    let basePrice = 50; // Prix par défaut

    // Recherche du prix de base dans les données si disponible
    const priceEntry = priceData.find(
      entry => entry.postalCode === postalCode && entry.airport === airport
    );
    
    if (priceEntry && priceEntry.price) {
      basePrice = parseFloat(priceEntry.price);
    }
    
    // Calcul du supplément en fonction du nombre de passagers
    let additionalFee = 0;
    
    switch(parseInt(passengers)) {
      case 3:
        additionalFee = 5;
        break;
      case 4:
        additionalFee = 10;
        break;
      case 5:
        additionalFee = 15;
        break;
      case 6:
        additionalFee = 20;
        break;
      case 7:
        additionalFee = 25;
        break;
      case 8:
        additionalFee = 30;
        break;
      default:
        // Pour 1-2 personnes, pas de supplément
        additionalFee = 0;
    }
    
    // Prix pour un trajet simple
    let price = basePrice + additionalFee;
    
    // Si c'est un aller-retour, doubler le prix
    if (tripType === TRIP_TYPES.ROUND_TRIP) {
      price = price * 2;
    }
    
    return parseFloat(price.toFixed(2)); // Arrondir à 2 décimales
  }

  // Fonction pour mettre à jour les informations de réservation
  const updateBookingData = (newData) => {
    setBookingData(prevData => {
      const updatedData = {
        ...prevData,
        ...newData
      };
      
      // Si des paramètres de prix changent, recalculer automatiquement
      // Ignorer si c'est seulement forceCalc qui est présent
      if (
        (newData.postalCode !== undefined || 
        newData.airport !== undefined || 
        newData.passengers !== undefined || 
        newData.tripType !== undefined) &&
        !newData.hasOwnProperty('forceCalc')
      ) {
        const newPrice = calculatePrice(
          updatedData.postalCode, 
          updatedData.airport, 
          updatedData.passengers, 
          updatedData.tripType
        );
        
        updatedData.calculatedPrice = newPrice;
      }
      
      // Conserver priceCalculated à true si forceCalc est présent
      if (newData.hasOwnProperty('forceCalc')) {
        setPriceCalculated(true);
      } else if (
        newData.postalCode !== undefined || 
        newData.airport !== undefined || 
        newData.passengers !== undefined || 
        newData.tripType !== undefined
      ) {
        setPriceCalculated(true);
      }
      
      return updatedData;
    });
  }

  // Fonction pour réinitialiser le formulaire
  const resetBookingData = () => {
    setBookingData({
      firstName: '',
      lastName: '',
      phone: '',
      email: '',
      street: '',
      houseNumber: '',
      postalCode: '',
      city: '',
      passengers: 1,
      luggage: 1,
      childSeats: 0,
      boosters: 0,
      airport: AIRPORTS[0],
      remarks: '',
      tripType: TRIP_TYPES.OUTBOUND,
      departureDate: null,
      departureTime: '',
      arrivalDate: null,
      arrivalTime: '',
      flightNumber: '',
      flightOrigin: '',
      calculatedPrice: 0,
    });
    setPriceCalculated(false);
  }

  const value = {
    bookingData,
    updateBookingData,
    calculatePrice,
    resetBookingData,
    priceCalculated,
    setPriceCalculated,
    AIRPORTS,
    TRIP_TYPES
  }

  return (
    <BookingContext.Provider value={value}>
      {children}
    </BookingContext.Provider>
  )
}