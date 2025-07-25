import React, { useContext } from 'react'
import './AppDownload.css'
import { assets } from '../../assets/assets'
import { ThemeContext } from '../../context/ThemeContext'

const AppDownload = () => {
  const { darkMode } = useContext(ThemeContext)
  
  return (
    <div className={`app-download ${darkMode ? 'dark-mode' : ''}`} id='app-download'>
      <h2>For A Better Experience</h2>
      <p>Get our <b>Yummiz</b> app for the best food recipe experience on mobile</p>
      <div className='app-download-platforms'>
        <a href="https://play.google.com/store" target="_blank" rel="noopener noreferrer">
          <img src={assets.play_store} alt="Get it on Google Play" />
        </a>
        <a href="https://www.apple.com/app-store" target="_blank" rel="noopener noreferrer">
          <img src={assets.app_store} alt="Download on App Store" />
        </a>
      </div>
    </div>
  )
}

export default AppDownload