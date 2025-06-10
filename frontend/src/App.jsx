import React, { useState, useEffect } from 'react'
import { Routes, Route } from 'react-router-dom'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

// Components
import Navbar from './components/Navbar/Navbar'
import Footer from './components/Footer/Footer'
import Login from './components/Login/Login'
import Register from './components/Register/Register'

// Pages
import Home from './pages/Home/Home'
import RecipeDetails from './pages/RecipeDetails/RecipeDetails'
import MyRecipes from './pages/MyRecipes/MyRecipes'
import SavedRecipe from './pages/SavedRecipe/SavedRecipe'
import AboutUs from './pages/AboutUs/AboutUs'
import Legal from './pages/Legal/Legal'

// Context
import StoreContextProvider from './context/StoreContext.jsx';
import { ThemeProvider } from './context/ThemeContext';

const App = () => {
  const [showLogin, setShowLogin] = useState(false)
  const [showRegister, setShowRegister] = useState(false)

  useEffect(() => {
    if (showLogin || showRegister) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'unset'
    }
  }, [showLogin, showRegister])

  const switchToRegister = () => {
    setShowLogin(false)
    setShowRegister(true)
  }

  const switchToLogin = () => {
    setShowRegister(false)
    setShowLogin(true)
  }

  return (
    <ThemeProvider>
      <StoreContextProvider>
        <div className={`App ${showLogin || showRegister ? 'overlay' : ''}`}>
          <ToastContainer />
          <Navbar setShowLogin={setShowLogin} />
          <Routes>
            <Route path="/" element={<Home setShowLogin={setShowLogin} />} />
            <Route path="/recipedetails" element={<RecipeDetails />} />
            <Route path="/my-recipes" element={<MyRecipes />} />
            <Route path="/saved-recipe/:id" element={<SavedRecipe />} />
            <Route path="/about-us" element={<AboutUs />} />
            <Route path="/legal" element={<Legal />} />
          </Routes>
          <Footer />
          {showLogin && (
            <div className="modal-overlay">
              <Login 
                setShowLogin={setShowLogin}
                switchToRegister={switchToRegister}
              />
            </div>
          )}
          {showRegister && (
            <div className="modal-overlay">
              <Register 
                setShowLogin={setShowLogin}
                switchToLogin={switchToLogin}
              />
            </div>
          )}
        </div>
      </StoreContextProvider>
    </ThemeProvider>
  )
}

export default App