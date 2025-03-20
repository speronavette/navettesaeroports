import { useState } from 'react'
import { Link, NavLink } from 'react-router-dom'

const Header = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  
  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen)
  }
  
  const closeMobileMenu = () => {
    setMobileMenuOpen(false)
  }
  
  // Style actif pour les liens de navigation
  const activeStyle = "text-primary font-medium"
  const navLinkStyle = "px-3 py-2 text-gray-700 hover:text-primary transition-colors"

  return (
    <header className="bg-white shadow-md">
      <div className="container-custom">
        <div className="flex justify-between items-center py-4">
          {/* Logo */}
          <Link to="/" className="flex items-center">
            <span className="text-xl font-bold text-primary">Navettes Aéroports</span>
          </Link>
          
          {/* Navigation desktop */}
          <nav className="hidden md:flex space-x-1">
            <NavLink 
              to="/" 
              className={({ isActive }) => 
                `${navLinkStyle} ${isActive ? activeStyle : ''}`
              }
              end
            >
              Accueil
            </NavLink>
            <NavLink 
              to="/about" 
              className={({ isActive }) => 
                `${navLinkStyle} ${isActive ? activeStyle : ''}`
              }
            >
              À propos
            </NavLink>
            <NavLink 
              to="/contact" 
              className={({ isActive }) => 
                `${navLinkStyle} ${isActive ? activeStyle : ''}`
              }
            >
              Contact
            </NavLink>
          </nav>
          
          {/* Bouton réservation (visible en desktop) */}
          <div className="hidden md:block">
            <Link 
              to="/#calculator" 
              className="btn-primary"
            >
              Réserver
            </Link>
          </div>
          
          {/* Bouton menu mobile */}
          <button 
            type="button" 
            className="md:hidden text-gray-500 hover:text-gray-700 focus:outline-none"
            onClick={toggleMobileMenu}
            aria-label="Menu"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              {mobileMenuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>
        
        {/* Menu mobile */}
        {mobileMenuOpen && (
          <div className="md:hidden py-4 border-t border-gray-200">
            <nav className="flex flex-col space-y-2">
              <NavLink 
                to="/" 
                className={({ isActive }) => 
                  `px-4 py-2 ${isActive ? activeStyle : 'text-gray-700'}`
                }
                onClick={closeMobileMenu}
                end
              >
                Accueil
              </NavLink>
              <NavLink 
                to="/about" 
                className={({ isActive }) => 
                  `px-4 py-2 ${isActive ? activeStyle : 'text-gray-700'}`
                }
                onClick={closeMobileMenu}
              >
                À propos
              </NavLink>
              <NavLink 
                to="/contact" 
                className={({ isActive }) => 
                  `px-4 py-2 ${isActive ? activeStyle : 'text-gray-700'}`
                }
                onClick={closeMobileMenu}
              >
                Contact
              </NavLink>
              <Link 
                to="/#calculator" 
                className="px-4 py-2 text-primary font-medium"
                onClick={closeMobileMenu}
              >
                Réserver
              </Link>
            </nav>
          </div>
        )}
      </div>
    </header>
  )
}

export default Header