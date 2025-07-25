import React, { useState, useEffect, useContext } from 'react'
import { Navigate } from 'react-router-dom'
import { ThemeContext } from '../../context/ThemeContext'
import FoodDisplay from '../../components/FoodDisplay/FoodDisplay'
import './MyRecipes.css'

const MyRecipes = () => {
  const [savedRecipes, setSavedRecipes] = useState([])
  const token = localStorage.getItem('token')
  const { darkMode } = useContext(ThemeContext)

  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem('savedRecipes') || '[]')
    // Add isSaved property to each recipe
    const recipesWithSavedFlag = saved.map(recipe => ({
      ...recipe,
      isSaved: true,
      navigateTo: `/saved-recipe/${recipe.id}`
    }))
    setSavedRecipes(recipesWithSavedFlag)
  }, [])

  if (!token) {
    return <Navigate to="/" replace />
  }

  return (
    <div className={`my-recipes-container ${darkMode ? 'dark-mode' : ''}`}>
      <h1>My Saved Recipes</h1>
      {savedRecipes.length > 0 ? (
        <FoodDisplay 
          category="All" 
          setShowLogin={() => {}} 
          customFoodList={savedRecipes}
        />
      ) : (
        <div className="no-recipes">
          <p>No recipes saved yet!</p>
          <p>Click the save button on any recipe to add it to your collection.</p>
        </div>
      )}
    </div>
  )
}

export default MyRecipes
