import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import Header from './Header'
import Footer from './Footer'

const Layout = ({ children }) => {
  const location = useLocation()
  
  // Scroll au début de la page lors des changements de route
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [location.pathname])
  
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-grow">{children}</main>
      <Footer />
    </div>
  )
}

export default Layout