import foodmodel from "../models/foodmodel.js";
import { v2 as cloudinary } from 'cloudinary';
import fs from "fs";
import mongoose from 'mongoose';

//add food item

const addFood = async (req, res) => {
    try {
        // Validate required fields
        const requiredFields = ['name', 'category', 'preptime', 'ingredients', 'description', 'rating'];
        for (const field of requiredFields) {
            if (!req.body[field]) {
                return res.status(400).json({
                    success: false,
                    message: `${field} is required`
                });
            }
        }

        // Validate file upload
        if (!req.file) {
            return res.status(400).json({
                success: false,
                message: "Image file is required"
            });
        }

        // Verify Cloudinary configuration
        if (!cloudinary.config().cloud_name || !cloudinary.config().api_key) {
            throw new Error('Invalid Cloudinary configuration');
        }

        // Category validation
        const validCategories = ['Salad','Rolls & Wraps','Pastry & Desserts','Sandwich','Veg','Non-Veg','Pasta & Noodles'];
        if (!validCategories.includes(req.body.category)) {
            return res.status(400).json({
                success: false,
                message: "Invalid category"
            });
        }

        // Upload to Cloudinary with error handling
        const result = await cloudinary.uploader.upload(req.file.path, {
            folder: 'yummiz/foods'
        }).catch(error => {
            throw new Error(`Cloudinary upload failed: ${error.message}`);
        });

        // Create food document
        const food = new foodmodel({
            name: req.body.name,
            preptime: req.body.preptime,
            category: req.body.category,
            image: result.secure_url,
            cloudinary_id: result.public_id,
            ingredients: req.body.ingredients,
            description: req.body.description,
            rating: req.body.rating
        });

        const savedFood = await food.save();
        
        // Clean up uploaded file
        fs.unlinkSync(req.file.path);
        
        return res.status(201).json({
            success: true,
            message: "Recipe added successfully",
            data: savedFood
        });
    } catch (error) {
        // Clean up file if exists
        if (req.file) {
            fs.unlinkSync(req.file.path);
        }
        console.error('Error adding food:', error);
        return res.status(400).json({
            success: false,
            message: error.message || "Failed to add recipe"
        });
    }
}

// all food items
const listFood = async (req, res) => {
    try {
      const food = await foodmodel.find({});
         res.json({success: true, data: food})  
    } catch (error) {
     console.log(error)
     res.json({success: false, message: "Food not found"})
    }
 }
 
// remove food item
const removeFood = async (req, res) => {
    try {
        const food = await foodmodel.findById(req.body.id);
        if (!food) {
            return res.status(404).json({
                success: false,
                message: "Food item not found"
            });
        }

        // Delete image from Cloudinary if exists
        if (food.cloudinary_id) {
            await cloudinary.uploader.destroy(food.cloudinary_id);
        }

        const result = await foodmodel.deleteOne({ _id: req.body.id });
        
        if (result.deletedCount === 1) {
            return res.status(200).json({
                success: true,
                message: "Food removed successfully"
            });
        } else {
            return res.status(400).json({
                success: false,
                message: "Failed to delete food item"
            });
        }
    }
    catch (error) {
        console.error('Delete error:', error);
        return res.status(500).json({
            success: false,
            message: "Server error while removing food",
            error: error.message
        });
    }
}

const getFood = async (req, res) => {
    try {
        // Validate if the id is a valid MongoDB ObjectId
        if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
            return res.status(400).json({
                success: false,
                message: "Invalid recipe ID format"
            });
        }

        const food = await foodmodel.findById(req.params.id);
        if (!food) {
            return res.status(404).json({
                success: false,
                message: "Recipe not found"
            });
        }
        
        return res.status(200).json({
            success: true,
            data: food
        });
    } catch (error) {
        console.error('Error fetching recipe:', error);
        return res.status(500).json({
            success: false,
            message: "Error fetching recipe",
            error: error.message
        });
    }
}

const updateFood = async (req, res) => {
    try {
        const oldFood = await foodmodel.findById(req.params.id);
        if (!oldFood) {
            return res.status(404).json({
                success: false,
                message: "Recipe not found"
            });
        }

        const updateData = { ...req.body };
        delete updateData.cloudinary_id; // Remove cloudinary_id from body data

        if (req.file) {
            // Verify Cloudinary configuration
            if (!cloudinary.config().cloud_name) {
                throw new Error('Cloudinary configuration missing');
            }

            try {
                // Delete old image if exists
                if (oldFood.cloudinary_id) {
                    await cloudinary.uploader.destroy(oldFood.cloudinary_id);
                }

                // Upload new image
                const result = await cloudinary.uploader.upload(req.file.path, {
                    folder: 'yummiz/foods'
                });

                // Set new Cloudinary data
                updateData.image = result.secure_url;
                updateData.cloudinary_id = result.public_id; // This should be a string

                // Clean up local file
                fs.unlinkSync(req.file.path);
            } catch (cloudinaryError) {
                console.error('Cloudinary error:', cloudinaryError);
                throw new Error('Failed to process image upload');
            }
        }

        const food = await foodmodel.findByIdAndUpdate(
            req.params.id,
            { $set: updateData },
            { new: true, runValidators: true }
        );

        res.status(200).json({
            success: true,
            message: "Recipe updated successfully",
            data: food
        });
    } catch (error) {
        if (req.file) fs.unlinkSync(req.file.path);
        console.error('Update error:', error);
        res.status(500).json({
            success: false,
            message: error.message || "Error updating recipe"
        });
    }
}

// Add this new function
const getFoodCount = async (req, res) => {
    try {
        const count = await foodmodel.countDocuments();
        res.json({ success: true, count });
    } catch (error) {
        console.error('Error getting food count:', error);
        res.status(500).json({
            success: false,
            message: 'Error getting food count'
        });
    }
};

export { 
    addFood, 
    listFood, 
    removeFood, 
    getFood, 
    updateFood, 
    getFoodCount
};
