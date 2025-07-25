import React, { useContext } from 'react'
import './FoodDisplay.css'
import { StoreContext } from '../../context/StoreContext'
import { useNavigate } from 'react-router-dom'
import StarRating from '../StarRating/StarRating'

const FoodDisplay = ({ category, setShowLogin, customFoodList }) => {
  const { foodList } = useContext(StoreContext)
  const navigate = useNavigate()
  const displayList = customFoodList || foodList

  const handleItemClick = (item) => {
    // Only require login for saved recipes section
    if (item.isSaved && !localStorage.getItem('token')) {
      setShowLogin(true);
      return;
    }
    
    if (item.isSaved) {
      navigate(item.navigateTo);
    } else {
      navigate('/recipedetails', { state: item });
    }
  }

  return (
    <div className='food-display' id='food-display'>
      <h2>{customFoodList ? 'Saved Recipes' : 'Top Dishes'}</h2>
      <div className="food-display-list">
        {!displayList ? (
          <div>Loading...</div>
        ) : (
          displayList.map((item) => {
            if (category === 'All' || category === item.category) {
              return (
                <div className='food-item' key={item.id} onClick={() => handleItemClick(item)}>
                  <img className='food-item-image' src={item.image} alt={item.name} />
                  <div className='food-item-info'>
                    <div className='food-item-name-rating'>
                      <span className='food-item-name truncate'>{item.name}</span>
                      <div className='food-item-rating'>
                        <StarRating rating={Number(item.rating)} />
                      </div>
                    </div>
                    <p className='food-item-category truncate'>{item.category}</p>
                    <p className='food-item-ingredients truncate-2-lines'>Ingredients: {item.ingredients}</p>
                    <p className='food-item-desc truncate-2-lines'>Description: {item.description}</p>
                    <p className='food-item-preparation-time truncate'>Prep-Time: {item.preparationTime} mins</p>
                  </div>
                </div>
              )
            }
            return null
          })
        )}
      </div>
    </div>
  )
}

export default FoodDisplay