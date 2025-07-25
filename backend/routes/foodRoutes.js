import express from "express";
import { 
    addFood, 
    listFood, 
    removeFood, 
    updateFood, 
    getFoodCount,
    getFood 
} from "../controllers/foodController.js";
import { upload } from "../controllers/uploadController.js";

const foodRouter = express.Router();

// Recipe CRUD routes
foodRouter.post("/addrecipe", upload.single("image"), addFood);
foodRouter.get("/listrecipe", listFood);
foodRouter.post("/remove", removeFood);
foodRouter.put("/edit/:id", upload.single("image"), updateFood);

// Count route - placed before `/:id` to avoid conflicts
foodRouter.get("/count", getFoodCount);

// Fetch a specific recipe by ID
foodRouter.get("/:id", getFood);

export default foodRouter;
