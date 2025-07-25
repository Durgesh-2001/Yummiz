// backend/models/RecipeRequest.js
import mongoose from 'mongoose';

const recipeRequestSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  requestedBy: { type: String, required: true },
  status: { type: String, enum: ['pending', 'approved', 'rejected'], default: 'pending' },
  adminMessage: { type: String, default: 'Your recipe is under review.' },
  createdAt: { type: Date, default: Date.now }
});

const RecipeRequest = mongoose.model('RecipeRequest', recipeRequestSchema);

export default RecipeRequest;