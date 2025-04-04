const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const nodemailer = require('nodemailer');
const fs = require('fs');
const path = require('path');
const { parse } = require('csv-parse/sync');
// Modules de sécurité commentés pour éviter les erreurs d'installation
// const helmet = require('helmet');
// const rateLimit = require('express-rate-limit');

// Charger les variables d'environnement
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware de sécurité commenté
// app.use(helmet());

// Configuration CORS améliorée
const allowedOrigins = [
  'https://navettesaeroports.be',
  'https://www.navettesaeroports.be',
  'https://navettesaeroports.onrender.com',
  'http://navettesaeroports.be',
  'http://www.navettesaeroports.be'
];

app.use(cors({
  origin: function(origin, callback) {
    // Permettre les requêtes sans origine (comme les appels API mobiles ou Postman)
    if (!origin) return callback(null, true);
    
    if (allowedOrigins.indexOf(origin) !== -1 || origin.match(/navettesaeroports\.be$/)) {
      callback(null, true);
    } else {
      callback(new Error('Non autorisé par CORS'));
    }
  },
  methods: ['GET', 'POST'],
  credentials: true,
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// Limite de taux commentée
// const apiLimiter = rateLimit({
//   windowMs: 15 * 60 * 1000, // 15 minutes
//   max: 100, // limite chaque IP à 101 requêtes par fenêtre
//   standardHeaders: true,
//   legacyHeaders: false,
//   message: 'Trop de requêtes depuis cette IP, veuillez réessayer après 15 minutes'
// });
// app.use('/api/', apiLimiter);

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

// Configuration sécurisée du transporteur d'emails
const createEmailTransporter = () => {
  const appPassword = (process.env.EMAIL_PASS || '').replace(/\s+/g, '');
  
  return nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 587,
    secure: false,
    auth: {
      user: process.env.EMAIL_USER || 'navettesaeroportsbelgium@gmail.com',
      pass: appPassword
    },
    tls: {
      rejectUnauthorized: true // Validation du certificat en production
    }
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
    version: '1.0.0'
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

// Route pour soumettre une réservation
app.post('/api/booking', async (req, res) => {
  try {
    const bookingData = req.body;
    
    // Validation approfondie des données
    if (!bookingData.firstName || !bookingData.lastName || !bookingData.email || 
        !bookingData.phone || !bookingData.street || !bookingData.postalCode || 
        !bookingData.city || !bookingData.airport || !bookingData.passengers) {
      return res.status(400).json({ error: 'Données incomplètes' });
    }
    
    // Validation email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(bookingData.email)) {
      return res.status(400).json({ error: 'Format d\'email invalide' });
    }
    
    // Validation téléphone (format international simple)
    const phoneRegex = /^[+]?[(]?[0-9]{3}[)]?[-\s.]?[0-9]{3}[-\s.]?[0-9]{4,6}$/;
    if (!phoneRegex.test(bookingData.phone.replace(/\s+/g, ''))) {
      return res.status(400).json({ error: 'Format de téléphone invalide' });
    }
   
    const emailTransporter = createEmailTransporter();
    
    // Vérifier que le transporteur fonctionne
    try {
      await emailTransporter.verify();
    } catch (verifyError) {
      console.error("Erreur de configuration email:", verifyError.message);
      return res.status(500).json({ 
        error: 'Erreur de configuration du service d\'email'
      });
    }
    
    // Configuration des options d'email
    const mailOptions = {
      from: `"Navettes Aéroports" <${process.env.EMAIL_USER || 'navettesaeroportsbelgium@gmail.com'}>`,
      to: process.env.EMAIL_TO || 'navettesaeroportsbelgium@gmail.com',
      subject: `Nouvelle réservation - ${bookingData.firstName} ${bookingData.lastName}`,
      html: generateEmailContent(bookingData)
    };
    
    try {
      const info = await emailTransporter.sendMail(mailOptions);
      
      return res.status(200).json({ 
        success: true, 
        message: 'Réservation enregistrée avec succès',
        reference: generateBookingReference(bookingData)
      });
    } catch (emailError) {
      console.error('Erreur d\'envoi d\'email:', emailError.message);
      
      return res.status(500).json({ 
        error: 'Erreur lors de l\'envoi de l\'email'
      });
    }
  } catch (error) {
    console.error('Erreur globale:', error.message);
    
    return res.status(500).json({ 
      error: 'Erreur lors du traitement de la réservation'
    });
  }
});

// Génération de référence de réservation unique
function generateBookingReference(bookingData) {
  const timestamp = new Date().getTime().toString(36).toUpperCase();
  const randomChars = Math.random().toString(36).substring(2, 6).toUpperCase();
  const nameInitials = (bookingData.firstName.charAt(0) + bookingData.lastName.charAt(0)).toUpperCase();
  
  return `NAV-${nameInitials}${randomChars}-${timestamp.slice(-4)}`;
}

// Gestion des erreurs 404
app.use((req, res) => {
  res.status(404).json({ error: 'Route non trouvée' });
});

// Gestion globale des erreurs
app.use((err, req, res, next) => {
  console.error('Erreur serveur:', err.message);
  res.status(500).json({ error: 'Erreur serveur interne' });
});

// Démarrer le serveur
app.listen(PORT, () => {
  console.log(`Serveur démarré sur le port ${PORT}`);
  console.log(`Environnement: ${process.env.NODE_ENV || 'development'}`);
});