const express = require("express");
const router = express.Router();

const controller = require("../controller/Admin/EventPayHistory");

router.post("/epay", controller.create);

router.get("/epay", controller.findAll);

router.get("/epay/:id", controller.findById);

router.get("/epay/event/:eventId", controller.findByEventId);

router.put("/epay/:id", controller.update);

router.delete("/epay/:id", controller.delete);

module.exports = router;