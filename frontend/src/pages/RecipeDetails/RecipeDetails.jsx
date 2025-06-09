import React, { useState, useEffect, useContext } from 'react'
import { useLocation, Navigate } from 'react-router-dom'
import './RecipeDetails.css'
import StarRating from '../../components/StarRating/StarRating'
import { ThemeContext } from '../../context/ThemeContext'

const RecipeDetails = () => {
  const { darkMode } = useContext(ThemeContext)
  const { state } = useLocation()
  
  const [isSaved, setIsSaved] = useState(false)
  const [showLogin, setShowLogin] = useState(false)
  const token = localStorage.getItem('token')

  const checkIfRecipeSaved = (recipeId) => {
    const savedRecipes = JSON.parse(localStorage.getItem('savedRecipes') || '[]')
    return savedRecipes.some(recipe => recipe.id === recipeId)
  }

  useEffect(() => {
    if (state) {
      setIsSaved(checkIfRecipeSaved(state.id))
    }
  }, [state])

  if (!state) {
    return <Navigate to="/" replace />
  }

  const handleSaveToggle = () => {
    if (!token) {
      setShowLogin(true);
      return;
    }
    const savedRecipes = JSON.parse(localStorage.getItem('savedRecipes') || '[]')
    
    if (!isSaved) {
      savedRecipes.push(state)
      localStorage.setItem('savedRecipes', JSON.stringify(savedRecipes))
    } else {
      const filteredRecipes = savedRecipes.filter(recipe => recipe.id !== state.id)
      localStorage.setItem('savedRecipes', JSON.stringify(filteredRecipes))
    }
    
    setIsSaved(!isSaved)
  }

  // Parse steps from description if it contains numbered steps
  const parseRecipeContent = (description = '', ingredients = '') => {
    // Parse description
    const parts = description?.split(/Steps for Cooking:/i) || ['', '']
    const mainDescription = parts[0]?.trim() || ''
    const stepsText = parts[1] || ''
    const steps = stepsText
      .split(/\d+\.\s*/)
      .filter(step => step.trim())
      .map(step => step.trim())

    // Parse ingredients into array and clean up
    const ingredientsList = ingredients
      ?.split(/[,\n•]/) // Split by comma, newline, or bullet points
      .map(ingredient => ingredient?.trim())
      .filter(ingredient => ingredient && ingredient.length > 0)
      .map(ingredient => ingredient.replace(/^\d+\.\s*/, '')) // Remove leading numbers
      .map(ingredient => ingredient.charAt(0).toUpperCase() + ingredient.slice(1)) || [] // Capitalize first letter

    return { mainDescription, steps, ingredientsList }
  }

  const { mainDescription, steps, ingredientsList } = parseRecipeContent(
    state?.description,
    state?.ingredients
  )

  return (
    <div className={`recipe-details ${darkMode ? 'dark-mode' : ''}`}>
      <div className="recipe-details-container">
        <img src={state.image} alt={state.name} className="recipe-image" />
        <div className="recipe-info">
          <div className="recipe-header">
            <h1>{state.name}</h1>
            {token && ( // Only show save button when logged in
              <button 
                className={`save-button ${isSaved ? 'saved' : ''}`}
                onClick={handleSaveToggle}
              >
                {isSaved ? 'Saved' : 'Save Recipe'}
              </button>
            )}
          </div>
          
          <div className="recipe-meta">
            <p className="category">Category: {state.category}</p>
            <p className="prep-time">
              Preparation Time: {state.preptime?.$numberInt || state.preparationTime} mins
            </p>
            <div className="rating">
              <StarRating rating={Number(state.rating?.$numberInt || state.rating)} />
            </div>
          </div>

          <div className="recipe-ingredients">
            <h2>Ingredients</h2>
            <ul className="ingredients-list">
              {ingredientsList.map((ingredient, index) => (
                <li key={index}>{ingredient}</li>
              ))}
            </ul>
          </div>

          <div className="recipe-description">
            <h2>Description</h2>
            <p>{mainDescription}</p>
          </div>

          <div className="recipe-steps">
            <h2>Steps for Cooking</h2>
            <ol className="steps-list">
              {steps.map((step, index) => (
                <li key={index}>
                  <span className="step-number">{index + 1}</span>
                  <p>{step}</p>
                </li>
              ))}
            </ol>
          </div>
        </div>
      </div>
    </div>
  )
}

export default RecipeDetails