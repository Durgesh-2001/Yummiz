import React from 'react'
import './Header.css'

const Header = () => {
  const handleViewNow = () => {
    document.getElementById('food-display').scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <div className='header'>
        <div className="header-contents">
            <h2>Discover</h2>
            <p>A world of culinary delights with our extensive collection of recipes. Whether you're a seasoned chef or a home cook, our recipes are designed to inspire and delight. From quick and easy meals to gourmet dishes, we have something for everyone. Explore new flavors, master cooking techniques, and bring joy to your kitchen with our step-by-step guides and delicious recipes.</p>
            <button onClick={handleViewNow}>View Now</button>
        </div>
    </div>
  )
}

export default Header