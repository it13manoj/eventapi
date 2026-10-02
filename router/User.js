const express = require("express");
const Route = express.Router();
const userController = require("../controller/Users/Users")
const Auth = require("../Middleware/Auth");
const upload = require("../utils/upload");
const { create, findByid, findAll, update: updateSalary, deletes: deleteSalary } = require("../controller/Users/Salary");

Route.post("/signup",userController.create)
Route.get("/all",userController.users)
Route.post("/login",userController.login)
Route.get("/find",Auth, userController.users);
Route.get("/find/:id",Auth, userController.findByid);
Route.get("/findByPk",Auth, userController.findByPk);
Route.put("/change-password", Auth, userController.changePassword);
Route.put("/profile-me", Auth, upload.fields([{ name: "img", maxCount: 1 }]), userController.updateMyProfile);
Route.put("/update/:id",Auth, upload.single("image"), userController.update);
Route.delete("/delete/:id", userController.deleteUser);
Route.delete("/profile/:id", userController.deleteUser);

Route.post("/salary/create",Auth,create);
Route.get("/salary/:id", Auth, findByid)
Route.get("/salary/",findAll)
Route.put("/salary/update/:id", Auth, updateSalary)
Route.delete("/salary/delete/:id", Auth, deleteSalary)


Route.get("/profile/:id", userController.getUserProfile);

Route.put(
  "/profile/:id",
  upload.fields([
    { name: "img", maxCount: 1 },
    { name: "adharcard_front", maxCount: 1 },
    { name: "adharcard_back", maxCount: 1 },
    { name: "insurance_pic", maxCount: 1 },
  ]),
  userController.updateUserProfile
);

Route.post(
  "/create",
  upload.fields([
    { name: "img", maxCount: 1 },
    { name: "adharcard_front", maxCount: 1 },
    { name: "adharcard_back", maxCount: 1 },
    { name: "insurance_pic", maxCount: 1 },
  ]),
  userController.createUserProfile
);
module.exports = Route;