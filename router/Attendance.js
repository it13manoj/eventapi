const express = require("express");
const { getByUserId, markAttendance, removeAttendance } = require("../controller/Admin/Attendance");

const Route = express.Router();

Route.get("/attendance/findByUserId/:userId", getByUserId);
Route.post("/attendance/mark", markAttendance);
Route.delete("/attendance/remove/:userId/:date", removeAttendance);

module.exports = Route;

