const express = require("express");
const { create,invoiceItems, update, find, findByPk, updateStatus, calculate , getDesign, findEventBookedItems, getBookedInventroyDate, ItemBooksDetails, bookedItemsInStocked, deletes} = require("../controller/Admin/Events");

const Route = express.Router();


Route.post("/Events/create", create)
Route.put("/Events/update/:id",update)
Route.get("/Events/find",find)
Route.delete("/Events/delete/:id", deletes)
Route.get("/Events/findByPk/:id", findByPk)
Route.put("/Events/updateStatus/:id", updateStatus)
Route.get("/Events/calculate/:date/:num/:catid/:scatid", calculate)
Route.get("/Events/Design/find", getDesign)
Route.get("/Events/bookedEvents/items/:id", findEventBookedItems)
Route.get("/Events/bookedEvents/itemsDate/:date/:catId/:subCatId", getBookedInventroyDate)
Route.get("/Events/bookedEvents/complete", ItemBooksDetails)
Route.get("/Events/bookedEvents/bookedItemsInStocked/:date/:catId/:subCatId/:stockId", bookedItemsInStocked)
Route.get("/Events/bookedEvents/invoices", invoiceItems)


module.exports = Route