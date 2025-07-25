import React, { useEffect, useState, useContext } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { ThemeContext } from '../../context/ThemeContext'
import StarRating from '../../components/StarRating/StarRating'
import './SavedRecipe.css'
import { toast } from 'react-toastify'

const SavedRecipeDetails = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const { darkMode } = useContext(ThemeContext)
  const [recipe, setRecipe] = useState(null)

  useEffect(() => {
    const savedRecipes = JSON.parse(localStorage.getItem('savedRecipes') || '[]')
    const foundRecipe = savedRecipes.find(recipe => recipe.id === id)
    if (!foundRecipe) {
      navigate('/my-recipes')
      return
    }
    setRecipe(foundRecipe)
  }, [id, navigate])

  const handleRemove = () => {
    if (window.confirm('Are you sure you want to remove this recipe from your collection?')) {
      const savedRecipes = JSON.parse(localStorage.getItem('savedRecipes') || '[]')
      const updatedRecipes = savedRecipes.filter(recipe => recipe.id !== id)
      localStorage.setItem('savedRecipes', JSON.stringify(updatedRecipes))
      toast.success('Recipe removed from your collection')
      navigate('/my-recipes')
    }
  }

  const parseRecipeContent = (description = '', ingredients = '') => {
    const parts = description?.split(/Steps for Cooking:/i) || ['', '']
    const mainDescription = parts[0]?.trim() || ''
    const stepsText = parts[1] || ''
    const steps = stepsText
      .split(/\d+\.\s*/)
      .filter(step => step.trim())
      .map(step => step.trim())

    const ingredientsList = ingredients
      ?.split(/[,\n•]/)
      .map(ingredient => ingredient?.trim())
      .filter(ingredient => ingredient && ingredient.length > 0)
      .map(ingredient => ingredient.replace(/^\d+\.\s*/, ''))
      .map(ingredient => ingredient.charAt(0).toUpperCase() + ingredient.slice(1)) || []

    return { mainDescription, steps, ingredientsList }
  }

  if (!recipe) {
    return <div className="recipe-not-found">Loading...</div>
  }

  const { mainDescription, steps, ingredientsList } = parseRecipeContent(
    recipe?.description,
    recipe?.ingredients
  )

  return (
    <div className={`saved-recipe-details ${darkMode ? 'dark-mode' : ''}`}>
      <div className="recipe-details-container">
        <img src={recipe.image} alt={recipe.name} className="recipe-image" />
        <div className="recipe-info">
          <div className="recipe-header">
            <h1>{recipe.name}</h1>
            <button 
              className="save-button"
              onClick={handleRemove}
            >
              Remove from Collection
            </button>
          </div>
          
          <div className="recipe-meta">
            <p className="category">Category: {recipe.category}</p>
            <p className="prep-time">Preparation Time: {recipe.preparationTime} mins</p>
            <div className="rating">
              <StarRating rating={Number(recipe.rating)} />
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

          {steps.length > 0 && (
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
          )}
        </div>
      </div>
    </div>
  )
}

export default SavedRecipeDetails
