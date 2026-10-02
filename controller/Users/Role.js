const Role = require("../../model/Role");
const { ERROR } = require("../../Response/Error");
const { SUCCESS } = require("../../Response/Success");


exports.createRole = async (req, res) => {
  try {
    const { role_name } = req.body;
    if (!role_name || role_name.trim() === "") {
      return res.status(400).json({ success: false, message: "Role name is required" });
    }

    const existingRole = await Role.findOne({ where: { role_name: role_name.trim() } });
    if (existingRole) {
      return res.status(300).json({ success: false, message: "Role already exists" });
    }

    const role = await Role.create({ role_name: role_name.trim() });
    return res.status(201).json({ success: true, message: "Role created successfully", data: role });
  } catch (error) {
    return res.status(500).json({ success: false, error: error.message });
  }
};

// Get all roles
exports.getAllRoles = async (req, res) => {
  try {
    const roles = await Role.findAll({ 
      attributes: ["id", "role_name"],
      order: [["id", "ASC"]] 
    });
    return res.status(200).json({ success: true, data: roles });
  } catch (error) {
    return res.status(500).json({ success: false, error: error.message });
  }
};

// Update role
exports.updateRole = async (req, res) => {
  try {
    const { id } = req.params;
    const { role_name } = req.body;

    if (!role_name || role_name.trim() === "") {
      return res.status(400).json({ success: false, message: "Role name is required" });
    }

    const role = await Role.findByPk(id);
    if (!role) {
      return res.status(404).json({ success: false, message: "Role not found" });
    }

    await role.update({ role_name: role_name.trim() });
    return res.status(200).json({ success: true, message: "Role updated successfully", data: role });
  } catch (error) {
    return res.status(500).json({ success: false, error: error.message });
  }
};

// Delete role
exports.deleteRole = async (req, res) => {
  try {
    const { id } = req.params;
    const role = await Role.findByPk(id);

    if (!role) {
      return res.status(404).json({ success: false, message: "Role not found" });
    }

    await role.destroy();
    return res.status(200).json({ success: true, message: "Role deleted successfully" });
  } catch (error) {
    return res.status(500).json({ success: false, error: error.message });
  }
};