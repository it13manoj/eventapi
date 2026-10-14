const express = require("express");
const {
  create,
  updates,
  deletes,
  find,
  findByid,
} = require("../controller/Admin/EventTemplate");

const Route = express.Router();

Route.post("/template/create", create);
Route.put("/template/update/:id", updates);
Route.get("/template/find", find);
Route.get("/template/all", find);
Route.delete("/template/delete/:id", deletes);
Route.get("/template/findByid/:id", findByid);

module.exports = Route;

