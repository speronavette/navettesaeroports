import axios from 'axios';

// Fonction pour formater les données de réservation pour l'affichage dans l'email
export const formatBookingDataForDisplay = (bookingData) => {
  const { 
    firstName, lastName, email, phone,
    street, houseNumber, postalCode, city,
    passengers, luggage, childSeats, boosters,
    airport, tripType, remarks,
    departureDate, departureTime,
    arrivalDate, arrivalTime,
    flightNumber, flightOrigin,
    calculatedPrice
  } = bookingData;

  // Formater les dates
  const formatDate = (date) => {
    if (!date) return 'Non spécifié';
    
    // Si c'est déjà une chaîne (depuis localStorage), la retourner telle quelle
    if (typeof date === 'string') return date;
    
    return new Date(date).toLocaleDateString('fr-FR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  // Déterminer le type de trajet
  let tripTypeText;
  switch(tripType) {
    case 'outbound':
      tripTypeText = 'Aller simple';
      break;
    case 'inbound':
      tripTypeText = 'Retour simple';
      break;
    case 'roundTrip':
      tripTypeText = 'Aller-retour';
      break;
    default:
      tripTypeText = 'Non spécifié';
  }

  // Récupérer le prix par trajet
  const pricePerTrip = tripType === 'roundTrip' ? calculatedPrice / 2 : calculatedPrice;

  return {
    fullName: `${firstName} ${lastName}`,
    contactInfo: {
      email,
      phone
    },
    address: {
      street: `${street} ${houseNumber}`,
      location: `${postalCode} ${city}`
    },
    travelDetails: {
      passengers,
      luggage,
      childSeats: childSeats || 0,
      boosters: boosters || 0,
      airport,
      tripType: tripTypeText,
      remarks: remarks || ''
    },
    outboundTrip: (tripType === 'outbound' || tripType === 'roundTrip') ? {
      date: formatDate(departureDate),
      time: departureTime || 'Non spécifié'
    } : null,
    inboundTrip: (tripType === 'inbound' || tripType === 'roundTrip') ? {
      date: formatDate(arrivalDate),
      time: arrivalTime || 'Non spécifié',
      flightNumber: flightNumber || 'Non spécifié',
      origin: flightOrigin || 'Non spécifié'
    } : null,
    pricing: {
      outboundPrice: (tripType === 'outbound' || tripType === 'roundTrip') ? pricePerTrip : null,
      inboundPrice: (tripType === 'inbound' || tripType === 'roundTrip') ? pricePerTrip : null,
      totalPrice: calculatedPrice
    }
  };
};

// Fonction pour envoyer l'email de réservation à l'administrateur
export const sendBookingEmail = async (bookingData) => {
  try {
    console.log("Préparation de l'email...");
    const formattedData = formatBookingDataForDisplay(bookingData);
    
    // Créer une copie des données pour éviter les problèmes de sérialisation
    const sanitizedBookingData = {
      ...bookingData,
      // Conversion des objets Date en chaînes de caractères
      departureDate: bookingData.departureDate ? 
        (typeof bookingData.departureDate === 'string' ? 
          bookingData.departureDate : 
          bookingData.departureDate.toISOString()) : 
        null,
      arrivalDate: bookingData.arrivalDate ? 
        (typeof bookingData.arrivalDate === 'string' ? 
          bookingData.arrivalDate : 
          bookingData.arrivalDate.toISOString()) : 
        null
    };
    
    // Construire le contenu de l'email pour l'administrateur
    const emailContent = `
      <h2 style="color: #6b46c1; font-size: 24px; margin-bottom: 16px;">Nouvelle réservation de navette</h2>
      
      <div style="margin-bottom: 24px; padding: 16px; background-color: #f3f4f6; border-radius: 8px;">
        <h3 style="color: #4b5563; font-size: 18px; margin-bottom: 12px;">Informations du client</h3>
        <p><strong>Nom:</strong> ${formattedData.fullName}</p>
        <p><strong>Email:</strong> ${formattedData.contactInfo.email}</p>
        <p><strong>Téléphone:</strong> ${formattedData.contactInfo.phone}</p>
        <p><strong>Adresse:</strong> ${formattedData.address.street}</p>
        <p><strong>Localité:</strong> ${formattedData.address.location}</p>
      </div>
      
      <div style="margin-bottom: 24px; padding: 16px; background-color: #f3f4f6; border-radius: 8px;">
        <h3 style="color: #4b5563; font-size: 18px; margin-bottom: 12px;">Détails du voyage</h3>
        <p><strong>Destination:</strong> ${formattedData.travelDetails.airport}</p>
        <p><strong>Type de trajet:</strong> ${formattedData.travelDetails.tripType}</p>
        <p><strong>Passagers:</strong> ${formattedData.travelDetails.passengers}</p>
        <p><strong>Bagages:</strong> ${formattedData.travelDetails.luggage}</p>
        ${formattedData.travelDetails.childSeats > 0 ? `<p><strong>Sièges enfant:</strong> ${formattedData.travelDetails.childSeats}</p>` : ''}
        ${formattedData.travelDetails.boosters > 0 ? `<p><strong>Réhausseurs:</strong> ${formattedData.travelDetails.boosters}</p>` : ''}
        ${bookingData.remarks ? `<p><strong>Remarques:</strong> ${bookingData.remarks}</p>` : ''}
      </div>
      
      ${formattedData.outboundTrip ? `
      <div style="margin-bottom: 24px; padding: 16px; background-color: #f3f4f6; border-radius: 8px;">
        <h3 style="color: #4b5563; font-size: 18px; margin-bottom: 12px;">Trajet aller (vers l'aéroport)</h3>
        <p><strong>Date:</strong> ${formattedData.outboundTrip.date}</p>
        <p><strong>Heure:</strong> ${formattedData.outboundTrip.time}</p>
      </div>
      ` : ''}
      
      ${formattedData.inboundTrip ? `
      <div style="margin-bottom: 24px; padding: 16px; background-color: #f3f4f6; border-radius: 8px;">
        <h3 style="color: #4b5563; font-size: 18px; margin-bottom: 12px;">Trajet retour (depuis l'aéroport)</h3>
        <p><strong>Date:</strong> ${formattedData.inboundTrip.date}</p>
        <p><strong>Heure:</strong> ${formattedData.inboundTrip.time}</p>
        <p><strong>Numéro de vol:</strong> ${formattedData.inboundTrip.flightNumber}</p>
        ${formattedData.inboundTrip.origin !== 'Non spécifié' ? `<p><strong>Provenance:</strong> ${formattedData.inboundTrip.origin}</p>` : ''}
      </div>
      ` : ''}
      
      <div style="margin-bottom: 24px; padding: 16px; background-color: #f8f5ff; border-radius: 8px; border-left: 4px solid #6b46c1;">
        <h3 style="color: #4b5563; font-size: 18px; margin-bottom: 12px;">Tarification</h3>
        ${formattedData.pricing.outboundPrice !== null ? `<p><strong>Trajet aller:</strong> ${formattedData.pricing.outboundPrice.toFixed(2)}€</p>` : ''}
        ${formattedData.pricing.inboundPrice !== null ? `<p><strong>Trajet retour:</strong> ${formattedData.pricing.inboundPrice.toFixed(2)}€</p>` : ''}
        <p style="font-size: 18px; font-weight: bold; margin-top: 8px;"><strong>Prix total:</strong> ${formattedData.pricing.totalPrice.toFixed(2)}€</p>
      </div>
    `;
    
    // Création de l'objet à envoyer au serveur
    const emailData = {
      to: 'navettesaeroportsbelgium@gmail.com', // Adresse de l'administrateur
      subject: `Nouvelle réservation - ${formattedData.fullName}`,
      html: emailContent
    };
    
    console.log("Envoi de l'email...");
    
    // Envoi de la requête au serveur avec le timeout augmenté
    const response = await axios.post(`${import.meta.env.VITE_SERVER_URL}/api/booking`, {
      ...sanitizedBookingData,
      emailData: emailData
    }, {
      timeout: 15000, // Augmenter le timeout à 15 secondes
      headers: {
        'Content-Type': 'application/json'
      }
    });
    
    console.log("Réponse du serveur:", response.data);
    return response.data;
  } catch (error) {
    console.error('Erreur lors de l\'envoi de l\'email:', error);
    // Ajouter plus de détails pour le débogage
    if (error.response) {
      // La requête a été faite et le serveur a répondu avec un code d'erreur
      console.error('Réponse du serveur:', error.response.data);
      console.error('Status:', error.response.status);
    } else if (error.request) {
      // La requête a été faite mais aucune réponse n'a été reçue
      console.error('Pas de réponse reçue:', error.request);
    }
    throw error;
  }
};