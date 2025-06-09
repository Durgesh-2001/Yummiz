import React from 'react'
import './Navbar.css'
import { assets } from '../../assets/assets.js'

const Navbar = () => (
  <div className='navbar'>
    <img className='logo' src={assets.logo} alt="Yummiz Logo" />
  </div>
)

export default Navbar
