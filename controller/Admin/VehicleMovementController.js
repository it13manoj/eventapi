const VehicleMovement = require("../../model/VehicleMovement");
const Vehicle = require("../../model/Vehicle");
const VehicleType = require("../../model/VehicleType");
const sequelize = require("../../db/conenction");

// Helper function to extract filename from Multer fields
const getUploadedFileName = (req, fieldName) => {
  if (req.files && req.files[fieldName] && req.files[fieldName][0]) {
    return req.files[fieldName][0].filename;
  }
  if (req.file && req.file.fieldname === fieldName) {
    return req.file.filename;
  }
  return null;
};

// 1. Create Initial Assignment (Status: ASSIGNED or custom)
exports.create = async (req, res) => {
  try {
    const {
      event_id,
      type,
      agent_name: agentName,
      vehicle_id,
      fuel_type,
      fuel_quantity,
      fuel_amount,
      loading_datetime,
      loading_location,
      unloading_datetime,
      unloading_location,
      event_loading_datetime,
      event_loading_location,
      event_unloading_datetime,
      event_unloading_location,
      status,
    } = req.body;

    const loading_image = getUploadedFileName(req, "loading_image");
    const unloading_image = getUploadedFileName(req, "unloading_image");
    const event_loading_image = getUploadedFileName(req, "event_loading_image");
    const event_unloading_image = getUploadedFileName(req, "event_unloading_image");

    const sanitizeDate = (val) => {
      if (!val || val === "null" || val === "undefined" || val === "Invalid date" || (typeof val === "string" && val.trim() === "")) return null;
      return val;
    };

    const result = await VehicleMovement.create({
      event_id,
      type: type || "OWNER",
      agent_name: agentName || null,
      vehicle_id,
      fuel_type: fuel_type || null,
      fuel_quantity: (!fuel_quantity || isNaN(Number(fuel_quantity))) ? 0 : Number(fuel_quantity),
      fuel_amount: (!fuel_amount || isNaN(Number(fuel_amount))) ? 0 : Number(fuel_amount),
      loading_image,
      loading_datetime: sanitizeDate(loading_datetime),
      loading_location: loading_location || null,
      unloading_image,
      unloading_datetime: sanitizeDate(unloading_datetime),
      unloading_location: unloading_location || null,
      event_loading_image,
      event_loading_datetime: sanitizeDate(event_loading_datetime),
      event_loading_location: event_loading_location || null,
      event_unloading_image,
      event_unloading_datetime: sanitizeDate(event_unloading_datetime),
      event_unloading_location: event_unloading_location || null,
      status: status || "ASSIGNED",
    });

    res.status(201).json({
      success: true,
      message: "Vehicle assigned successfully",
      data: result,
      results: result,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// 2. Confirm Vehicle Loading (Status: LOADING)
exports.confirmLoading = async (req, res) => {
  try {
    const { event_id, loading_datetime, loading_location } = req.body;
    const loading_image = getUploadedFileName(req, "loading_image");

    const movement = await VehicleMovement.findOne({ where: { event_id } });

    if (!movement) {
      return res.status(404).json({
        success: false,
        message: "No vehicle movement record found for this event",
      });
    }

    await movement.update({
      loading_datetime: loading_datetime || new Date(),
      loading_location,
      loading_image: loading_image || movement.loading_image,
      status: "LOADING",
    });

    res.json({
      success: true,
      message: "Vehicle loading confirmed successfully",
      data: movement,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// 3. Confirm Vehicle Unloading (Status: UNLOADING)
exports.confirmUnloading = async (req, res) => {
  try {
    const { event_id, unloading_datetime, unloading_location } = req.body;
    const unloading_image = getUploadedFileName(req, "unloading_image");

    const movement = await VehicleMovement.findOne({ where: { event_id } });

    if (!movement) {
      return res.status(404).json({
        success: false,
        message: "No vehicle movement record found for this event",
      });
    }

    await movement.update({
      unloading_datetime: unloading_datetime || new Date(),
      unloading_location,
      unloading_image: unloading_image || movement.unloading_image,
      status: "UNLOADING",
    });

    res.json({
      success: true,
      message: "Vehicle unloading confirmed successfully",
      data: movement,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// 4. Update Movement Record (Handles loading, unloading, event_loading, event_unloading images)
exports.update = async (req, res) => {
  try {
    const movement = await VehicleMovement.findByPk(req.params.id);

    if (!movement) {
      return res.status(404).json({
        success: false,
        message: "Record not found",
      });
    }

    const updateData = { ...req.body };

    // Process all possible uploaded image fields
    const loading_image = getUploadedFileName(req, "loading_image");
    const unloading_image = getUploadedFileName(req, "unloading_image");
    const event_loading_image = getUploadedFileName(req, "event_loading_image");
    const event_unloading_image = getUploadedFileName(req, "event_unloading_image");

    if (loading_image) updateData.loading_image = loading_image;
    if (unloading_image) updateData.unloading_image = unloading_image;
    if (event_loading_image) updateData.event_loading_image = event_loading_image;
    if (event_unloading_image) updateData.event_unloading_image = event_unloading_image;

    const dateFields = ["loading_datetime", "unloading_datetime", "event_loading_datetime", "event_unloading_datetime"];
    dateFields.forEach(f => {
      if (updateData[f] !== undefined) {
        if (!updateData[f] || updateData[f] === "null" || updateData[f] === "undefined" || updateData[f] === "Invalid date" || (typeof updateData[f] === "string" && updateData[f].trim() === "")) {
          updateData[f] = null;
        }
      }
    });

    if (updateData.fuel_quantity !== undefined) {
      updateData.fuel_quantity = (!updateData.fuel_quantity || isNaN(Number(updateData.fuel_quantity))) ? 0 : Number(updateData.fuel_quantity);
    }
    if (updateData.fuel_amount !== undefined) {
      updateData.fuel_amount = (!updateData.fuel_amount || isNaN(Number(updateData.fuel_amount))) ? 0 : Number(updateData.fuel_amount);
    }

    await movement.update(updateData);

    res.json({
      success: true,
      message: "Vehicle Movement updated successfully",
      data: movement,
      results: movement,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// 5. Find All Records
exports.findAll = async (req, res) => {
  try {
    const result = await VehicleMovement.findAll({
      order: [["id", "DESC"]],
    });

    res.json({
      success: true,
      data: result,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// 6. Find By ID
exports.findById = async (req, res) => {
  try {
    const result = await VehicleMovement.findByPk(req.params.id);

    if (!result) {
      return res.status(404).json({
        success: false,
        message: "Record not found",
      });
    }

    res.json({
      success: true,
      data: result,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// 7. Find By Event ID (Joined with Vehicle details)
exports.findByEvent = async (req, res) => {
  try {
    const result = await sequelize.query(
      `SELECT vm.*, v.name, v.vehicle_number, v.owner_agency, v.contact, v.driver_contact, v.ownershiptype, v.load_capacity, v.commission, v.insurance, v.image
       FROM vehicle_movements vm
       LEFT JOIN vehicles v ON v.id = vm.vehicle_id
       WHERE vm.event_id = :eventId
       ORDER BY vm.id DESC`,
      {
        replacements: { eventId: req.params.eventId },
        type: sequelize.QueryTypes.SELECT,
      }
    );

    res.json({
      success: true,
      data: result,
      results: result,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// 8. Update Status Only
exports.updateStatus = async (req, res) => {
  try {
    const movement = await VehicleMovement.findByPk(req.params.id);

    if (!movement) {
      return res.status(404).json({
        success: false,
        message: "Record not found",
      });
    }

    await movement.update({
      status: req.body.status,
    });

    res.json({
      success: true,
      message: "Status updated successfully",
      data: movement,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// 9. Delete Assignment Record
exports.delete = async (req, res) => {
  try {
    const deleted = await VehicleMovement.destroy({
      where: { id: req.params.id },
    });

    if (!deleted) {
      return res.status(404).json({
        success: false,
        message: "Record not found",
      });
    }

    res.json({
      success: true,
      message: "Deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};