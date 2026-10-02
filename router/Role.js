const express = require("express");
const Route = express.Router();
const RoleController = require("../controller/Users/Role")

Route.get("/profile", (req, res) => {
    console.log("welcome");
    res.send("Profile API working");
});

Route.get("/role", RoleController.getAllRoles);
Route.post("/role/create", RoleController.createRole);
Route.put("/role/:id", RoleController.updateRole);
Route.delete("role/:id", RoleController.deleteRole);





module.exports = Route;