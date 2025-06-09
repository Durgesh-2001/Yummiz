import { createContext, useState, useEffect } from 'react';
import axios from 'axios';
import { API_BASE_URL } from '../utils/config';
import { getImageUrl } from '../utils/imageUrls';

export const StoreContext = createContext({});

const StoreContextProvider = (props) => {
  const [foodList, setFoodList] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchFoodList = async () => {
      setIsLoading(true);
      try {
        const response = await axios.get(`${API_BASE_URL}/api/food/listrecipe`);
        if (response.data.success) {
          const formattedRecipes = response.data.data.map(recipe => ({
            id: recipe._id,
            name: recipe.name,
            description: recipe.description,
            ingredients: recipe.ingredients,
            preparationTime: recipe.preptime,
            rating: recipe.rating,
            image: getImageUrl(recipe.image),
            category: recipe.category
          }));
          setFoodList(formattedRecipes);
        }
      } catch (error) {
        console.error('Error fetching food list:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchFoodList();
  }, []);

  return (
    <StoreContext.Provider value={{ foodList, setFoodList, isLoading }}>
      {props.children}
    </StoreContext.Provider>
  );
};

export default StoreContextProvider;
