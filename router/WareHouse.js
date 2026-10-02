const express = require("express")
const { create, update , deletes, find, findbyid } = require("../controller/Admin/WareHouse")

const Route = express.Router()

Route.post("/warehouse/create", create)
Route.put("/warehouse/update/:id",update)
Route.get("/warehouse/find",find)
Route.delete("/warehouse/delete/:id", deletes)
Route.get("/warehouse/findByid/:id", findbyid)


module.exports = Route