import express from "express";
import RecipeRequest from "../models/RecipeRequest.js";
import Notification from "../models/notifications.js";

const router = express.Router();

// Route to submit a new recipe request
router.post("/submit", async (req, res) => {
  try {
    const title = req.body.recipeName || req.body.title;
    const { description, requestedBy } = req.body;

    if (!title || !description || !requestedBy) {
      return res.status(400).json({
        success: false,
        message: "Title (or recipeName), description, and requestedBy are required",
        received: { title, description, requestedBy },
      });
    }

    const recipeRequest = new RecipeRequest({
      title,
      description,
      requestedBy,
      status: "pending",
      createdAt: new Date(),
    });

    const savedRequest = await recipeRequest.save();

    res.status(201).json({
      success: true,
      message: "Recipe request submitted successfully",
      request: savedRequest,
    });
  } catch (error) {
    console.error("Error in recipe request submission:", error);
    res.status(500).json({
      success: false,
      message: "Failed to submit recipe request",
      error: error.message,
    });
  }
});

// Route to handle status updates (approve/reject)
router.post("/:status", async (req, res) => {
  const { requestId, message } = req.body;
  const { status } = req.params;

  if (!["approved", "rejected"].includes(status)) {
    return res.status(400).json({
      success: false,
      message: 'Invalid status. Status must be either "approved" or "rejected".',
    });
  }

  try {
    const recipeRequest = await RecipeRequest.findById(requestId);
    if (!recipeRequest) {
      return res.status(404).json({ message: "Recipe request not found" });
    }

    // Update the request status
    recipeRequest.status = status;
    
    // Format the admin message
    const defaultMessage = status === "approved"
      ? `Your recipe request for "${recipeRequest.title}" has been approved! You can now find it on Yummiz.`
      : `Your recipe request for "${recipeRequest.title}" has been rejected.`;
      
    const adminMessage = message 
      ? `${defaultMessage}\n\nAdmin Message:\n${message}`
      : defaultMessage;

    recipeRequest.adminMessage = adminMessage;
    await recipeRequest.save();

    // Create notification with formatted message
    await Notification.create({
      userId: recipeRequest.requestedBy,
      message: `From Yummiz Admin\nStatus: ${status.toUpperCase()}\n${adminMessage}`,
      type: 'recipe_request',
      status: status,
      createdAt: new Date()
    });

    res.status(200).json({
      success: true,
      message: `Recipe request ${status} successfully`,
      recipeRequest,
    });
  } catch (error) {
    console.error(`Error updating recipe request status to ${status}:`, error);
    res.status(500).json({
      success: false,
      message: `Failed to ${status} recipe request`,
      error: error.message,
    });
  }
});

// Route to get the count of recipe requests
router.get("/count", async (req, res) => {
  try {
    const totalRequests = await RecipeRequest.countDocuments({});
    const approvedRequests = await RecipeRequest.countDocuments({ status: "approved" });
    const pendingRequests = await RecipeRequest.countDocuments({ status: "pending" });
    const rejectedRequests = await RecipeRequest.countDocuments({ status: "rejected" });

    res.json({
      success: true,
      total: totalRequests,
      approved: approvedRequests,
      pending: pendingRequests,
      rejected: rejectedRequests,
    });
  } catch (error) {
    console.error("Error fetching recipe request counts:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch recipe request counts",
      error: error.message,
    });
  }
});

// Route to fetch all recipe requests
router.get("/", async (req, res) => {
  try {
    const requests = await RecipeRequest.find().sort({ createdAt: -1 });
    res.status(200).json({
      success: true,
      requests,
    });
  } catch (error) {
    console.error("Error fetching recipe requests:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch recipe requests",
      error: error.message,
    });
  }
});

export default router;
