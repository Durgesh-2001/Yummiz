import React, { useState, useEffect } from 'react';
import './EditRecipe.css';
import axios from 'axios';
import { toast } from 'react-toastify';
import StarRating from '../../components/StarRating/StarRating';
import { assets } from '../../assets/assets';

const API_BASE_URL = import.meta.env.VITE_BACKEND_URL;

const EditRecipe = () => {
  const [recipes, setRecipes] = useState([]);
  const [editingRecipe, setEditingRecipe] = useState(null);
  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const url = API_BASE_URL;

  useEffect(() => {
    fetchRecipes();
  }, []);

  const fetchRecipes = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${url}/api/food/listrecipe`);
      if (response.data.success) {
        setRecipes(response.data.data);
      }
    } catch (error) {
      console.error('Error fetching recipes:', error);
      toast.error(error.response?.data?.message || 'Error loading recipes');
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = async (recipeId) => {
    try {
      setLoading(true);
      const response = await axios.get(`${url}/api/food/${recipeId}`);
      if (response.data.success) {
        setEditingRecipe({
          ...response.data.data,
          preptime: response.data.data.preptime || '',
          ingredients: response.data.data.ingredients || '',
          description: response.data.data.description || ''
        });
      }
    } catch (error) {
      console.error('Error loading recipe:', error);
      toast.error(error.response?.data?.message || 'Error loading recipe details');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      const formData = new FormData();
      if (image) {
        formData.append('image', image);
      }
      
      // Add cloudinary_id if exists
      if (editingRecipe.cloudinary_id) {
        formData.append('cloudinary_id', editingRecipe.cloudinary_id);
      }
      
      // Append all recipe data to formData
      Object.keys(editingRecipe).forEach(key => {
        if (key !== 'image' && key !== '_id' && editingRecipe[key]) {
          formData.append(key, editingRecipe[key]);
        }
      });

      const response = await axios.put(
        `${url}/api/food/edit/${editingRecipe._id}`,
        formData,
        {
          headers: { 'Content-Type': 'multipart/form-data' }
        }
      );

      if (response.data.success) {
        toast.success('Recipe updated successfully');
        setEditingRecipe(null);
        setImage(null);
        fetchRecipes();
      }
    } catch (error) {
      console.error('Error updating recipe:', error);
      toast.error(error.response?.data?.message || 'Error updating recipe');
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditingRecipe(prev => ({
      ...prev,
      [name]: value
    }));
  };

  return (
    <div className="edit-recipe">
      {!editingRecipe ? (
        <div className="recipes-grid">
          {recipes.map((recipe) => (
            <div key={recipe._id} className="recipe-card">
              <div className="recipe-image">
                <img 
                  src={recipe.image} // Using Cloudinary URL directly
                  alt={recipe.name}
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = assets.no_image;
                  }}
                />
              </div>
              <div className="recipe-content">
                <h3>{recipe.name}</h3>
                <p className="category">{recipe.category}</p>
                <button 
                  className="edit-button"
                  onClick={() => handleEdit(recipe._id)}
                >
                  Edit Recipe
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <form className="edit-form" onSubmit={handleUpdate}>
          <div className="form-group image-upload">
            <label>Upload Image</label>
            <img 
              src={image ? URL.createObjectURL(image) : editingRecipe.image} // Use Cloudinary URL directly
              alt=""
              onClick={() => document.getElementById('image').click()}
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = assets.no_image;
              }}
            />
            <input 
              onChange={(e) => setImage(e.target.files[0])} 
              type="file" 
              id="image" 
              hidden 
            />
          </div>

          <div className="form-group">
            <label>Recipe Name</label>
            <input
              type="text"
              name="name"
              value={editingRecipe.name}
              onChange={handleInputChange}
              placeholder="Recipe Name"
              required
            />
          </div>

          <div className="form-group">
            <label>Category</label>
            <div className="category-grid">
              {['Salad', 'Rolls & Wraps', 'Pastry & Desserts', 'Sandwich', 'Veg', 'Non-Veg', 'Pasta & Noodles'].map((category) => (
                <label key={category}>
                  <input 
                    type="radio" 
                    name="category" 
                    value={category} 
                    onChange={handleInputChange}
                    checked={editingRecipe.category === category}
                    required 
                  />
                  {category}
                </label>
              ))}
            </div>
          </div>

          <div className="form-group">
            <label>Preparation Time</label>
            <input
              type="number"
              name="preptime"
              value={editingRecipe.preptime}
              onChange={handleInputChange}
              placeholder="Prep Time (in minutes)"
              required
              max="60"
            />
          </div>

          <div className="form-group">
            <label>Rating</label>
            <StarRating
              rating={Number(editingRecipe.rating)}
              setRating={(value) => handleInputChange({
                target: { name: 'rating', value }
              })}
            />
          </div>

          <div className="form-group">
            <label>Recipe Ingredients</label>
            <textarea
              name="ingredients"
              value={editingRecipe.ingredients}
              onChange={handleInputChange}
              rows="3"
              placeholder="List ingredients here"
              required
            />
          </div>

          <div className="form-group">
            <label>Recipe Description</label>
            <textarea
              name="description"
              value={editingRecipe.description}
              onChange={handleInputChange}
              rows="6"
              placeholder="Write content here"
              required
            />
          </div>

          <div className="form-actions">
            <button type="submit">Save Changes</button>
            <button type="button" onClick={() => setEditingRecipe(null)}>
              Cancel
            </button>
          </div>
        </form>
      )}
    </div>
  );
};

export default EditRecipe;
