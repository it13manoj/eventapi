const express = require("express")
const { create, update , deletes, find, findById } = require("../controller/Admin/VehicleType")

const Route = express.Router()

Route.post("/vehicle/create", create)
Route.put("/vehicle/update/:id",update)
Route.get("/vehicle/find",find)
Route.delete("/vehicle/delete/:id", deletes)
Route.get("/vehicle/findByid/:id",findById)


module.exports = Route