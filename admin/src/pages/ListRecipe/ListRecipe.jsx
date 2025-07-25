import React, { useEffect, useState } from 'react';
import './ListRecipe.css';
import axios from 'axios';
import { toast } from 'react-toastify';

const ListRecipe = () => {
  const API_BASE_URL = import.meta.env.VITE_BACKEND_URL || 'https://yummiz.up.railway.app';
  const [list, setList] = useState([]);

  const fetchList = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/api/food/listrecipe`);
      if (response.data && response.data.data) {
        setList(response.data.data);
        toast.success("Recipes fetched successfully");
      } else {
        setList([]);
        toast.error("No recipes found");
      }
    } catch (error) {
      setList([]);
      toast.error(`Error fetching recipes: ${error.response?.data?.message || error.message}`);
    }
  };

  const removeFood = async (foodId) => {
    if (window.confirm('Are you sure you want to delete this recipe?')) {
      try {
        await axios.post(`${API_BASE_URL}/api/food/remove`, { id: foodId });
        await fetchList();
        toast.success("Recipe deleted successfully");
      } catch (error) {
        toast.error(`Error deleting recipe: ${error.response?.data?.message || error.message}`);
      }
    }
  };

  useEffect(() => { 
    fetchList(); 
  }, []);

  return (
    <div className="list add flex-col">
      <p>All Recipe List</p>
      <div className="recipe-grid">
        {list && list.length > 0 ? (
          list.map((item, index) => (
            <div key={index} className="recipe-card">
              <div className="recipe-image">
                <img 
                  src={item.image} // Cloudinary URL is already complete
                  alt={item.name}
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = '/no_image.png';
                  }}
                  loading="lazy"
                />
              </div>
              <div className="recipe-info">
                <h3 className="recipe-name" title={item.name}>{item.name}</h3>
                <button 
                  onClick={() => removeFood(item._id)} 
                  className='delete-btn' 
                  title="Delete Recipe"
                >
                  Delete
                </button>
              </div>
            </div>
          ))
        ) : (
          <div className="no-recipes">No recipes found</div>
        )}
      </div>
    </div>
  );
};

export default ListRecipe;
