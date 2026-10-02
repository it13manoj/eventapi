const express = require("express");
const { create, update, find, deletes, findByPk, findBycategories, findBycategoriesAndSubCategories, calculate ,countsItems, Items, eventStocks  } = require("../controller/Admin/Inventory");
const Route = express.Router();
const { geoDistanceAPI } = require("../controller/Admin/GeoCalculator");

Route.post("/Inverntory/create", create)
Route.put("/Inverntory/update/:id",update)
Route.get("/Inverntory/find",find)
Route.delete("/Inverntory/delete/:id", deletes)
Route.get("/Inverntory/findByPk/:id", findByPk)
Route.get("/Inverntory/findBycategories/:id", findBycategories)
Route.get("/Inverntory/findBycategoriesAndSubCategories/:cid/:sid", findBycategoriesAndSubCategories)
Route.get("/Inverntory/calculate/:catId/:scatId", calculate)
Route.get("/Inverntory/items/calculate/:id", countsItems)
Route.get("/Inverntory/items/find/:id", Items)
Route.get("/Inverntory/items/eventStocks/:date/:catId/:scatId", eventStocks)
Route.get("/Inverntory/getDistances/:from/:to", geoDistanceAPI)

module.exports = Route