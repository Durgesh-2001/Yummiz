import React, { useState } from 'react'
import './AddRecipe.css'
import { assets } from '../../assets/assets'
import axios from 'axios'
import { toast } from 'react-toastify'
import StarRating from '../../components/StarRating/StarRating'

const API_BASE_URL = import.meta.env.VITE_BACKEND_URL;

const AddRecipe = () => {
  const url = API_BASE_URL;
  const [image, setImage] = useState(false)
  const [data, setData] = useState({ 
    name: '', 
    category: '', 
    preptime: '', 
    rating: 1.0,
    ingredients: '',
    description: '', 
  })

  const onChangeHandler = (e) => {
    const { name, value } = e.target;
    setData((prevData) => ({ ...prevData, [name]: value }));
  }

  const onSubmitHandler = async (e) => {
    e.preventDefault();
    try {
      if (!image) {
        toast.error('Please select an image');
        return;
      }

      const formData = new FormData();
      formData.append('image', image);
      Object.keys(data).forEach(key => {
        if (data[key]) formData.append(key, data[key]);
      });

      const response = await axios.post(`${url}/api/food/addrecipe`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });

      if (response.data.success) {
        setData({ 
          name: '', 
          description: '', 
          category: '', 
          preptime: '', 
          rating: 1,
          ingredients: ''
        });
        setImage(false);
        toast.success('Recipe added successfully!');
      }
    } catch (error) {
      console.error('Upload Error:', error.response?.data || error);
      toast.error(error.response?.data?.message || 'Failed to add recipe');
    }
  }

  return (
    <div className='add-recipe'>
      <form className='flex-col' onSubmit={onSubmitHandler}>
        <div className="add-image-upload flex-col">
          <p>Upload Image (Supported formats: JPG, JPEG, PNG)</p>
          <label htmlFor="image">
            <img 
              src={image ? URL.createObjectURL(image) : assets.upload_area} 
              alt="" 
              style={{ maxWidth: '400px', objectFit: 'contain' }} 
            />
          </label>
          <input 
            onChange={(e) => {
              const file = e.target.files[0];
              if (file && (file.type === 'image/jpeg' || file.type === 'image/png')) {
                setImage(file);
              } else {
                toast.error('Please upload a valid image file (JPG, JPEG, PNG)');
              }
            }} 
            type="file" 
            id="image" 
            accept="image/jpeg,image/png"
            hidden 
            required 
          />
        </div>
        <div className="add-recipe-name flex-col">
          <p>Recipe Name</p>
          <input onChange={onChangeHandler} value={data.name} type="text" id="name" name="name" placeholder="Recipe Name" required />
        </div>
        <div className="add-category">
          <p>Category</p>
          <div className="category-grid">
            {['Salad', 'Rolls & Wraps', 'Pastry & Desserts', 'Sandwich', 'Veg', 'Non-Veg', 'Pasta & Noodles'].map((category) => (
              <label key={category}>
                <input type="radio" name="category" value={category} onChange={onChangeHandler} required />
                {category}
              </label>
            ))}
          </div>
        </div>
        <div className="add-preptime flex col">
          <p>Preparation Time</p>
          <div className="preptime-input">
            <input onChange={onChangeHandler} value={data.preptime} type="number" name="preptime" placeholder="Prep Time" required max="60" />
            <span>minutes</span>
          </div>
        </div>
        <div className="add-rating flex-col">
          <p>Rating</p>
          <div className="rating-input">
            <StarRating 
              rating={Number(data.rating)} 
              setRating={(value) => setData(prev => ({ ...prev, rating: value }))}
            />
          </div>
        </div>
        <div className="add-recipe-ingredients flex-col">
          <p>Recipe Ingredients</p> <textarea onChange={onChangeHandler} value={data.ingredients} name="ingredients" rows="3" placeholder="List ingredients here" required />
        </div>
        <div className="add-recipe-description flex-col">
          <p>Recipe Description</p>
          <textarea onChange={onChangeHandler} value={data.description} name="description" rows="6" placeholder="Write content here" required />
        </div>
        <button type="submit" className="add-btn">Add Recipe</button>
      </form>
    </div>
  )
}

export default AddRecipe