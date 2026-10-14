const EventTemplate = require("../../model/EventTemplate");
const { ERROR } = require("../../Response/Error");
const { SUCCESS } = require("../../Response/Success");

// CREATE
exports.create = async (req, res) => {
  try {
    const { name, total_price, description, items } = req.body;

    if (!name || String(name).trim() === "") {
      return res.status(400).send(ERROR("Template name is required"));
    }

    const template = await EventTemplate.create({
      name: String(name).trim(),
      total_price: total_price !== undefined && total_price !== null ? parseFloat(total_price) : 0.0,
      description: description || "",
      items: Array.isArray(items) ? items : [],
    });

    res.send(SUCCESS("Template created successfully!", template));
  } catch (error) {
    console.error("Error creating template:", error);
    res.status(500).send(ERROR(error.message));
  }
};

// FIND ALL
exports.find = async (req, res) => {
  try {
    const templates = await EventTemplate.findAll({
      order: [["created_at", "DESC"]],
    });
    res.send(SUCCESS("Templates fetched successfully!", templates));
  } catch (error) {
    console.error("Error fetching templates:", error);
    res.status(500).send(ERROR(error.message));
  }
};

// FIND BY ID
exports.findByid = async (req, res) => {
  try {
    const { id } = req.params;
    const template = await EventTemplate.findByPk(id);

    if (!template) {
      return res.status(404).send(ERROR("Template not found"));
    }

    res.send(SUCCESS("Template fetched successfully!", template));
  } catch (error) {
    console.error("Error fetching template:", error);
    res.status(500).send(ERROR(error.message));
  }
};

// UPDATE
exports.updates = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, total_price, description, items } = req.body;

    const template = await EventTemplate.findByPk(id);
    if (!template) {
      return res.status(404).send(ERROR("Template not found"));
    }

    if (name !== undefined) template.name = String(name).trim();
    if (total_price !== undefined) template.total_price = parseFloat(total_price) || 0.0;
    if (description !== undefined) template.description = description;
    if (items !== undefined) template.items = Array.isArray(items) ? items : [];

    await template.save();

    res.send(SUCCESS("Template updated successfully!", template));
  } catch (error) {
    console.error("Error updating template:", error);
    res.status(500).send(ERROR(error.message));
  }
};

// DELETE
exports.deletes = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedCount = await EventTemplate.destroy({
      where: { id },
    });

    if (!deletedCount) {
      return res.status(404).send(ERROR("Template not found"));
    }

    res.send(SUCCESS("Template deleted successfully!", { id }));
  } catch (error) {
    console.error("Error deleting template:", error);
    res.status(500).send(ERROR(error.message));
  }
};

