import mongoose from "mongoose";

const foodSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    preptime: {
        type: Number,
        required: true,
        min: 1,
        max: 60
    },
    category: {
        type: String,
        required: true
    },
    image: {
        type: String,
        required: true,
        validate: {
            validator: function(v) {
                return v.startsWith('http://') || v.startsWith('https://');
            },
            message: 'Image must be a valid URL'
        }
    },
    cloudinary_id: {
        type: String,
        required: true,
        validate: {
            validator: function(v) {
                return typeof v === 'string';
            },
            message: 'Cloudinary ID must be a string'
        }
    },
    description: {
        type: String,
        required: true
    },
    ingredients: {
        type: String,
        required: true
    },
    rating: {
        type: Number,
        required: true,
        min: 0.5,
        max: 5,
        validate: {
            validator: function(v) {
                return v % 0.5 === 0; // Only allow multiples of 0.5
            },
            message: 'Rating must be a multiple of 0.5'
        }
    }
}, { timestamps: true });

const foodmodel = mongoose.models.food || mongoose.model('food', foodSchema);

export default foodmodel;