import Papa from 'papaparse'

/**
 * Charge les données de prix depuis un fichier CSV
 * @returns {Promise<Array>} Les données de prix
 */
export const loadPriceData = async () => {
  try {
    const response = await fetch('/data/prices.csv')
    if (!response.ok) {
      throw new Error('Impossible de charger les données de prix')
    }
    
    const csvText = await response.text()
    
    // Utilisation de Papa Parse pour analyser le CSV
    const result = Papa.parse(csvText, {
      header: true,
      skipEmptyLines: true,
      dynamicTyping: true // Convertit automatiquement les nombres
    })
    
    if (result.errors.length > 0) {
      console.error('Erreurs lors de l\'analyse du CSV:', result.errors)
      throw new Error('Erreur lors de l\'analyse du fichier de prix')
    }
    
    return result.data
  } catch (error) {
    console.error('Erreur lors du chargement des prix:', error)
    throw error
  }
}

/**
 * Calcule le prix d'un trajet en fonction des paramètres
 * @param {string} postalCode - Code postal de départ
 * @param {string} airport - Aéroport/gare de destination
 * @param {number} passengers - Nombre de passagers
 * @param {Array} priceData - Données de prix
 * @param {boolean} isReturnTrip - S'agit-il d'un aller-retour?
 * @returns {number} - Le prix calculé
 */
export const calculatePrice = (postalCode, airport, passengers, priceData, isReturnTrip = false) => {
  if (!postalCode || !airport || !passengers || !priceData || !priceData.length) {
    return 0
  }

  // Recherche du prix de base dans les données
  const priceEntry = priceData.find(
    entry => entry.postalCode === postalCode && entry.airport === airport
  )

  if (!priceEntry) {
    return 0
  }

  let basePrice = parseFloat(priceEntry.price)
  
  // Ajustement du prix en fonction du nombre de passagers
  // Ces règles peuvent être ajustées selon vos besoins
  if (passengers > 4) {
    basePrice *= 1.5 // +50% pour plus de 4 passagers
  }
  
  // Multiplicateur pour l'aller-retour (exemple: réduction de 10%)
  const returnMultiplier = isReturnTrip ? 1.9 : 1 // 2 - 0.1 pour 10% de réduction
  
  // Prix final arrondi à 2 décimales
  return Math.round(basePrice * returnMultiplier * 100) / 100
}

/**
 * Obtient la liste des codes postaux uniques
 * @param {Array} priceData - Données de prix
 * @returns {Array} - Liste des codes postaux uniques
 */
export const getUniquePostalCodes = (priceData) => {
  if (!priceData || !priceData.length) return []
  return [...new Set(priceData.map(entry => entry.postalCode))].sort()
}

/**
 * Obtient la liste des aéroports/gares uniques
 * @param {Array} priceData - Données de prix
 * @returns {Array} - Liste des aéroports/gares uniques
 */
export const getUniqueAirports = (priceData) => {
  if (!priceData || !priceData.length) return []
  return [...new Set(priceData.map(entry => entry.airport))].sort()
}