import { Routes, Route } from 'react-router-dom'
import { useState, useEffect } from 'react'
import Layout from './components/common/Layout'
import Home from './pages/Home'
import Booking from './pages/Booking'
import About from './pages/About'
import Contact from './pages/Contact'
import Confirmation from './pages/Confirmation'
import { BookingProvider } from './contexts/BookingContext'
import Papa from 'papaparse'

function App() {
  const [priceData, setPriceData] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Chargement des données de prix au démarrage de l'application
    const loadPriceData = async () => {
      try {
        const response = await fetch('/data/prices.csv')
        if (!response.ok) {
          console.warn('Fichier de prix non trouvé, utilisation de données fictives')
          setPriceData([])
          setLoading(false)
          return
        }
        
        const csvText = await response.text()
        
        // Utiliser Papa Parse pour analyser le CSV correctement
        Papa.parse(csvText, {
          header: true,
          skipEmptyLines: true,
          complete: (results) => {
            if (results.errors.length > 0) {
              console.error('Erreurs d\'analyse CSV:', results.errors)
            }
            setPriceData(results.data)
            setLoading(false)
          },
          error: (error) => {
            console.error('Erreur lors de l\'analyse du CSV:', error)
            setPriceData([])
            setLoading(false)
          }
        });
      } catch (error) {
        console.error('Erreur lors du chargement des prix:', error)
        setPriceData([])
        setLoading(false)
      }
    }

    loadPriceData()
  }, [])

  if (loading) {
    return <div className="flex items-center justify-center h-screen">Chargement...</div>
  }

  return (
    <BookingProvider priceData={priceData}>
      <Layout>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/booking" element={<Booking />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/confirmation" element={<Confirmation />} />
        </Routes>
      </Layout>
    </BookingProvider>
  )
}

export default App