const express = require("express")
const { create, updates, deletes, find, findByid } = require("../controller/Admin/Categories")

const Route = express.Router()

Route.post("/category/create", create)
Route.put("/category/update/:id",updates)
Route.get("/category/find",find)
Route.delete("/category/delete/:id", deletes)
Route.get("/category/findByid/:id", findByid)


module.exports = Route