const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const nodemailer = require('nodemailer');
const fs = require('fs');
const path = require('path');
const { parse } = require('csv-parse/sync');

// Charger les variables d'environnement
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors({
  origin: process.env.CORS_ORIGIN || 'http://localhost:5173',
  methods: ['GET', 'POST'],
  credentials: true
}));
app.use(express.json({ limit: '10mb' }));

// Charger les données de prix
let priceData = [];
try {
  const csvFilePath = path.join(__dirname, 'data', 'prices.csv');
  
  // Vérifier si le fichier existe
  if (fs.existsSync(csvFilePath)) {
    const csvData = fs.readFileSync(csvFilePath, 'utf8');
    priceData = parse(csvData, { columns: true, skip_empty_lines: true });
    console.log(`Données de prix chargées: ${priceData.length} entrées.`);
  } else {
    console.warn('Fichier CSV de prix non trouvé:', csvFilePath);
  }
} catch (error) {
  console.error('Erreur lors du chargement des données de prix:', error);
}

// Problème potentiel : les espaces dans le mot de passe d'application
// Voici comment le corriger dans la configuration du transporteur
const createEmailTransporter = () => {
  const appPassword = (process.env.EMAIL_PASS || 'jptf qhlx ztmr knwp').replace(/\s+/g, '');
  
  return nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 587,
    secure: false,
    auth: {
      user: process.env.EMAIL_USER || 'navettesaeroportsbelgium@gmail.com',
      pass: appPassword // Mot de passe sans espaces
    },
    tls: {
      rejectUnauthorized: false
    },
    debug: true,
    logger: true
  });
};

// Fonction pour générer le contenu HTML de l'email
const generateEmailContent = (data) => {
  // Formater les dates pour l'affichage
  const formatDate = (date) => {
    if (!date) return 'Non spécifiée';
    
    // Si c'est déjà une chaîne (depuis localStorage), la retourner telle quelle
    if (typeof date === 'string') {
      // Si c'est une date au format ISO
      if (date.includes('T')) {
        return new Date(date).toLocaleDateString('fr-FR', {
          day: '2-digit',
          month: '2-digit',
          year: 'numeric'
        });
      }
      return date;
    }
    
    // Si c'est un objet Date
    return new Date(date).toLocaleDateString('fr-FR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  // Obtenir le texte pour le type de trajet
  const getTripTypeText = (tripType) => {
    switch(tripType) {
      case 'roundTrip': return 'Aller-retour';
      case 'outbound': return 'Aller simple';
      case 'inbound': return 'Retour simple';
      default: return 'Non spécifié';
    }
  };
  
  // Calculer le prix par trajet (pour l'aller-retour)
  const pricePerTrip = data.tripType === 'roundTrip' 
    ? data.calculatedPrice / 2 
    : data.calculatedPrice;

  return `
    <html>
    <head>
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; }
        .header { background-color: #6b46c1; color: white; padding: 20px; text-align: center; border-radius: 5px 5px 0 0; }
        .content { padding: 20px; border: 1px solid #ddd; border-top: none; border-radius: 0 0 5px 5px; }
        .section { margin-bottom: 25px; }
        .section-title { color: #6b46c1; border-bottom: 1px solid #eee; padding-bottom: 5px; margin-bottom: 15px; font-size: 18px; }
        .info-item { margin-bottom: 8px; }
        .label { font-weight: bold; }
        .price-section { background-color: #f9f9f9; padding: 15px; margin-top: 20px; border-radius: 5px; }
        .total-price { font-size: 18px; font-weight: bold; color: #6b46c1; margin-top: 10px; }
        .footer { text-align: center; margin-top: 20px; font-size: 12px; color: #666; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>Nouvelle Réservation de Navette</h1>
        </div>
        
        <div class="content">
          <div class="section">
            <h2 class="section-title">Informations du client</h2>
            <div class="info-item"><span class="label">Nom complet:</span> ${data.firstName} ${data.lastName}</div>
            <div class="info-item"><span class="label">Email:</span> ${data.email}</div>
            <div class="info-item"><span class="label">Téléphone:</span> ${data.phone}</div>
            <div class="info-item"><span class="label">Adresse:</span> ${data.street} ${data.houseNumber}</div>
            <div class="info-item"><span class="label">Code postal:</span> ${data.postalCode}</div>
            <div class="info-item"><span class="label">Ville:</span> ${data.city}</div>
          </div>
          
          <div class="section">
            <h2 class="section-title">Détails du voyage</h2>
            <div class="info-item"><span class="label">Type de trajet:</span> ${getTripTypeText(data.tripType)}</div>
            <div class="info-item"><span class="label">Destination:</span> ${data.airport}</div>
            <div class="info-item"><span class="label">Nombre de passagers:</span> ${data.passengers}</div>
            <div class="info-item"><span class="label">Nombre de bagages:</span> ${data.luggage}</div>
            ${data.childSeats > 0 ? `<div class="info-item"><span class="label">Sièges enfant:</span> ${data.childSeats}</div>` : ''}
            ${data.boosters > 0 ? `<div class="info-item"><span class="label">Réhausseurs:</span> ${data.boosters}</div>` : ''}
            ${data.remarks ? `<div class="info-item"><span class="label">Remarques:</span> ${data.remarks}</div>` : ''}
          </div>
          
          ${(data.tripType === 'outbound' || data.tripType === 'roundTrip') ? `
          <div class="section">
            <h2 class="section-title">Détails du trajet aller</h2>
            <div class="info-item"><span class="label">Date de départ:</span> ${formatDate(data.departureDate)}</div>
            <div class="info-item"><span class="label">Heure de départ:</span> ${data.departureTime || 'Non spécifiée'}</div>
          </div>
          ` : ''}
          
          ${(data.tripType === 'inbound' || data.tripType === 'roundTrip') ? `
          <div class="section">
            <h2 class="section-title">Détails du trajet retour</h2>
            <div class="info-item"><span class="label">Date d'arrivée:</span> ${formatDate(data.arrivalDate)}</div>
            <div class="info-item"><span class="label">Heure d'arrivée:</span> ${data.arrivalTime || 'Non spécifiée'}</div>
            <div class="info-item"><span class="label">Numéro de vol:</span> ${data.flightNumber || 'Non spécifié'}</div>
            ${data.flightOrigin ? `<div class="info-item"><span class="label">Provenance:</span> ${data.flightOrigin}</div>` : ''}
          </div>
          ` : ''}
          
          <div class="section price-section">
            <h2 class="section-title">Tarification</h2>
            ${data.tripType === 'roundTrip' ? `
            <div class="info-item"><span class="label">Trajet aller:</span> ${pricePerTrip.toFixed(2)}€</div>
            <div class="info-item"><span class="label">Trajet retour:</span> ${pricePerTrip.toFixed(2)}€</div>
            ` : `
            <div class="info-item"><span class="label">Trajet ${data.tripType === 'outbound' ? 'aller' : 'retour'}:</span> ${pricePerTrip.toFixed(2)}€</div>
            `}
            <div class="total-price">Prix total: ${data.calculatedPrice.toFixed(2)}€</div>
          </div>
          
          <div class="section">
            <h2 class="section-title">Informations supplémentaires</h2>
            <p>Cette réservation a été effectuée le ${new Date().toLocaleDateString('fr-FR')} à ${new Date().toLocaleTimeString('fr-FR')}.</p>
            <p>Un de nos chauffeurs prendra contact avec le client pour confirmer les détails.</p>
          </div>
          
          <div class="footer">
            <p>Cet email a été envoyé automatiquement. Merci de ne pas y répondre.</p>
            <p>&copy; ${new Date().getFullYear()} Navettes Aéroports - Tous droits réservés</p>
          </div>
        </div>
      </div>
    </body>
    </html>
  `;
};

// Route de diagnostic pour vérifier que le serveur fonctionne
app.get('/', (req, res) => {
  res.json({ 
    status: 'ok', 
    message: 'API de réservation de navettes aéroport en ligne',
    routes: ['/api/prices', '/api/calculate-price', '/api/booking']
  });
});

// Route pour obtenir les données de prix
app.get('/api/prices', (req, res) => {
  if (!priceData || priceData.length === 0) {
    return res.status(404).json({ error: 'Données de prix non disponibles' });
  }
  res.json(priceData);
});

// Route pour calculer un prix
app.post('/api/calculate-price', (req, res) => {
  const { postalCode, airport, passengers, tripType } = req.body;
  
  if (!postalCode || !airport || !passengers) {
    return res.status(400).json({ error: 'Données incomplètes' });
  }
  
  // Recherche du prix de base dans les données
  const priceEntry = priceData.find(
    entry => entry.postalCode === postalCode && entry.airport === airport
  );
  
  if (!priceEntry) {
    return res.status(404).json({ error: 'Prix non trouvé' });
  }
  
  let basePrice = parseFloat(priceEntry.price);
  
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
  if (tripType === 'roundTrip') {
    price = price * 2;
  }
  
  res.json({ price: parseFloat(price.toFixed(2)) });
});

// Route pour tester l'envoi d'email
app.get('/api/test-email', async (req, res) => {
  console.log("Test d'envoi d'email...");
  
  try {
    console.log("Création du transporteur d'emails...");
    const emailTransporter = createEmailTransporter();
    
    // Vérifier que le transporteur fonctionne
    try {
      await emailTransporter.verify();
      console.log("Transporteur d'emails validé avec succès");
    } catch (verifyError) {
      console.error("Erreur lors de la vérification du transporteur:", verifyError);
      return res.status(500).json({ 
        error: 'Erreur de configuration du service d\'email',
        details: verifyError.message,
        code: verifyError.code || 'UNKNOWN'
      });
    }
    
    // Données de test pour l'email
    const testData = {
      firstName: 'Test',
      lastName: 'Utilisateur',
      email: 'test@example.com',
      phone: '0123456789',
      street: 'Rue de Test',
      houseNumber: '123',
      postalCode: '1000',
      city: 'Bruxelles',
      airport: 'Aéroport de Bruxelles',
      tripType: 'roundTrip',
      passengers: 2,
      luggage: 2,
      childSeats: 1,
      boosters: 0,
      departureDate: new Date(),
      departureTime: '08:00',
      arrivalDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // Dans une semaine
      arrivalTime: '18:00',
      flightNumber: 'SN123',
      flightOrigin: 'Paris',
      calculatedPrice: 120
    };
    
    // Envoyer un email de test
    const mailOptions = {
      from: `"Navettes Aéroports" <${process.env.EMAIL_USER || 'navettesaeroportsbelgium@gmail.com'}>`,
      to: process.env.EMAIL_TO || 'navettesaeroportsbelgium@gmail.com',
      subject: 'Test d\'envoi d\'email',
      html: generateEmailContent(testData)
    };
    
    const info = await emailTransporter.sendMail(mailOptions);
    console.log('Email de test envoyé avec succès:', {
      messageId: info.messageId,
      response: info.response
    });
    
    return res.status(200).json({ 
      success: true, 
      message: 'Email de test envoyé avec succès',
      details: {
        messageId: info.messageId,
        response: info.response
      }
    });
  } catch (error) {
    console.error('Erreur lors de l\'envoi de l\'email de test:', error);
    return res.status(500).json({ 
      error: 'Erreur lors de l\'envoi de l\'email de test',
      details: error.message,
      code: error.code || 'UNKNOWN'
    });
  }
});

// Route pour soumettre une réservation
app.post('/api/booking', async (req, res) => {
  console.log("Début de la route /api/booking");
  
  try {
    const bookingData = req.body;
    const emailData = bookingData.emailData || null;
    
    console.log("Données reçues:", JSON.stringify({
      name: `${bookingData.firstName} ${bookingData.lastName}`,
      email: bookingData.email,
      emailDataPresent: !!emailData
    }));
   
    // Validation de base
    if (!bookingData.firstName || !bookingData.lastName || !bookingData.email) {
      console.log("Validation échouée: données incomplètes");
      return res.status(400).json({ error: 'Données incomplètes' });
    }
   
    console.log("Création du transporteur d'emails...");
    const emailTransporter = createEmailTransporter();
    
    // Vérifier que le transporteur fonctionne
    try {
      await emailTransporter.verify();
      console.log("Transporteur d'emails validé avec succès");
    } catch (verifyError) {
      console.error("Erreur lors de la vérification du transporteur:", verifyError);
      // Envoyer une réponse avec plus de détails sur l'erreur
      return res.status(500).json({ 
        error: 'Erreur de configuration du service d\'email',
        details: verifyError.message,
        code: verifyError.code || 'UNKNOWN'
      });
    }
    
    // Configuration des options d'email
    const mailOptions = {
      from: `"Navettes Aéroports" <${process.env.EMAIL_USER || 'navettesaeroportsbelgium@gmail.com'}>`,
      to: process.env.EMAIL_TO || 'navettesaeroportsbelgium@gmail.com',
      subject: `Nouvelle réservation - ${bookingData.firstName} ${bookingData.lastName}`,
      html: emailData?.html || generateEmailContent(bookingData)
    };
    
    console.log("Options d'email configurées:", {
      from: mailOptions.from,
      to: mailOptions.to,
      subject: mailOptions.subject
    });
    
    try {
      console.log("Tentative d'envoi d'email...");
      const info = await emailTransporter.sendMail(mailOptions);
      console.log('Email envoyé avec succès:', {
        messageId: info.messageId,
        response: info.response
      });
      
      return res.status(200).json({ 
        success: true, 
        message: 'Réservation enregistrée avec succès'
      });
    } catch (emailError) {
      console.error('Erreur lors de l\'envoi de l\'email:', {
        message: emailError.message,
        code: emailError.code,
        command: emailError.command,
        responseCode: emailError.responseCode,
        response: emailError.response
      });
      
      return res.status(500).json({ 
        error: 'Erreur lors de l\'envoi de l\'email',
        details: emailError.message,
        code: emailError.code || 'UNKNOWN'
      });
    }
  } catch (error) {
    console.error('Erreur globale:', {
      message: error.message,
      stack: error.stack,
      name: error.name
    });
    
    return res.status(500).json({ 
      error: 'Erreur lors du traitement de la réservation', 
      details: error.message 
    });
  }
});

// Démarrer le serveur
app.listen(PORT, () => {
  console.log(`Serveur démarré sur le port ${PORT}`);
  console.log(`URL de l'API: http://localhost:${PORT}`);
});