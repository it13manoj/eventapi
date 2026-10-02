const express = require("express");
const { create, getAll, update, getById, deletes, agents} = require("../controller/Admin/AgentOwnerController");

const Route = express.Router();


Route.post("/AgentOwner/create", create)
Route.put("/AgentOwner/update/:id",update)
Route.get("/AgentOwner/find",getAll)
Route.get("/AgentOwner/:id", getById)
Route.delete("/AgentOwner/deletes/:id", deletes)
Route.delete("/AgentOwner/delete/:id", deletes)
Route.get("/AgentOwner/agents/find", agents)



module.exports = Route