import React, { useState, useEffect } from 'react'
import './Home.css'
import Header from '../../components/Header/Header'
import ExploreDishes from '../../components/ExploreDishes/ExploreDishes'
import FoodDisplay from '../../components/FoodDisplay/FoodDisplay'
import AppDownload from '../../components/AppDownload/AppDownload'

const Home = ({ setShowLogin }) => {
  const [category, setCategory] = useState('All')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Simulate loading time for better UX
    const timer = setTimeout(() => {
      setLoading(false)
    }, 1000)

    return () => clearTimeout(timer)
  }, [])

  const handleCategoryChange = (newCategory) => {
    setLoading(true)
    setCategory(newCategory)
    // Simulate loading time when changing categories
    setTimeout(() => {
      setLoading(false)
    }, 500)
  }

  return (
    <div className="home">
      <Header setShowLogin={setShowLogin} />
      <ExploreDishes 
        category={category} 
        setCategory={handleCategoryChange} 
      />
      {loading ? (
        <div className="loading-spinner">Loading...</div>
      ) : (
        <FoodDisplay category={category} setShowLogin={setShowLogin} />
      )}
      <AppDownload />
    </div>
  )
}

export default Home