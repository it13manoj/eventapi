const express = require("express");
const { createTeamAssign, find , findInstallUnInstallDate, findByUserId, deleteAssignUsers, updateTeamAssign, deleteTeamAssign } = require("../controller/Admin/TeamAssign");


const Route = express.Router();


Route.post("/teamAssign/create", createTeamAssign)
Route.put("/teamAssign/update/:id", updateTeamAssign)
Route.get("/teamAssign/find/:id",find)
Route.get("/teamAssign/findByUserId/:id",findByUserId)
Route.get("/teamAssign/install/undinstall/:id",findInstallUnInstallDate)
Route.delete("/teamAssign/deleteAssignUsers/:id", deleteAssignUsers)
Route.delete("/teamAssign/delete/:id", deleteTeamAssign)



module.exports = Route