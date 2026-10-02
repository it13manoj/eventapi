const express = require("express");
const router = express.Router();
const upload = require("../utils/upload");
const controller = require("../controller/Admin/VehicleMovementController");

// Configure Multer field mapping for stage-specific file uploads
const cpUpload = upload.fields([
  { name: "loading_image", maxCount: 1 },
  { name: "unloading_image", maxCount: 1 },
  { name: "event_loading_image", maxCount: 1 },
  { name: "event_unloading_image", maxCount: 1 },
]);

// Creation & General Retrieval
router.post("/vehicle-movement/create", cpUpload, controller.create);
router.get("/vehicle-movement/find", controller.findAll);
router.get("/vehicle-movement/find/:id", controller.findById);
router.get("/vehicle-movement/event/:eventId", controller.findByEvent);

// Stage-Specific Workflows (Updated to PATCH)
// Use PUT or POST instead of PATCH
router.put("/vehicle-movement/confirm-loading", cpUpload, controller.confirmLoading);
router.put("/vehicle-movement/confirm-unloading", cpUpload, controller.confirmUnloading);

// Flexible Updates (Supports PUT & POST for multipart forms)
router.put("/vehicle-movement/update/:id", cpUpload, controller.update);
router.post("/vehicle-movement/update/:id", cpUpload, controller.update);

// Status & Deletion
router.put("/vehicle-movement/status/:id", controller.updateStatus);
router.delete("/vehicle-movement/delete/:id", controller.delete);

module.exports = router;