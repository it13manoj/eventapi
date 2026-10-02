const express = require("express");
const router = express.Router();
const upload = require("../utils/upload");
const { create, getAll, getById, update, deletes } = require("../controller/Admin/Companies");

const cpUpload = upload.fields([
    { name: "logo", maxCount: 1 },
    { name: "image", maxCount: 1 }
]);

router.post("/Companies", cpUpload, create);
router.get("/Companies", getAll);
router.get("/Companies/:id", getById);
router.put("/Companies/:id", cpUpload, update);
router.post("/Companies/:id", cpUpload, update);
router.delete("/Companies/:id", deletes);

module.exports = router;