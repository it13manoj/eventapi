const express = require("express");
const Route = express.Router();
const { create, findByVehicletype, find, findById, update, delets , agentVehicle} = require("../controller/Admin/Vehicle")
const Auth = require("../Middleware/Auth");
const upload = require("../utils/upload");


Route.post("/vehicleDetails/create",upload.single("image"), create)
Route.get("/vehicleDetails/find",find)
Route.get("/vehicleDetails/findBytype/:id",findByVehicletype)
Route.get("/vehicleDetails/findById/:id",findById)
Route.put("/vehicleDetails/update/:id", upload.single("image"), update)
Route.put("/vehicleDetails/delete/:id", delets)
Route.delete("/vehicleDetails/delete/:id", delets)
Route.get("/vehicleDetails/agency/find/:type", agentVehicle)
Route.get("/vehicleDetails/agency/find/:type/:name", agentVehicle)

module.exports = Route;