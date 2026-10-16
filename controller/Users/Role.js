const Role = require("../../model/Role");
const User = require("../../model/User");
const { ERROR } = require("../../Response/Error");
const { SUCCESS } = require("../../Response/Success");

exports.createRole = async (req, res) => {
  try {
    const { role_name, description, permissions } = req.body;
    if (!role_name || role_name.trim() === "") {
      return res.status(400).json({ success: false, message: "Role name is required" });
    }

    const trimmedName = role_name.trim();
    const existingRole = await Role.findOne({ where: { role_name: trimmedName } });
    if (existingRole) {
      return res.status(300).json({ success: false, message: `Role "${trimmedName}" already exists` });
    }

    let parsedPermissions = permissions;
    if (typeof permissions === "string") {
      try {
        parsedPermissions = JSON.parse(permissions);
      } catch (e) {
        parsedPermissions = null;
      }
    }

    const role = await Role.create({
      role_name: trimmedName,
      description: description ? description.trim() : null,
      permissions: parsedPermissions || null,
    });

    return res.status(201).json({ success: true, message: "Role created successfully", data: role });
  } catch (error) {
    return res.status(500).json({ success: false, error: error.message });
  }
};

// Get all roles with user counts and permissions
exports.getAllRoles = async (req, res) => {
  try {
    const roles = await Role.findAll({
      attributes: ["id", "role_name", "description", "permissions", "created_at", "updated_at"],
      order: [["id", "ASC"]],
    });

    // Count users for each role
    const rolesWithCounts = await Promise.all(
      roles.map(async (r) => {
        const userCount = await User.count({ where: { role_id: r.id } });
        const plain = r.toJSON();
        return {
          ...plain,
          user_count: userCount,
        };
      })
    );

    return res.status(200).json({ success: true, data: rolesWithCounts, results: rolesWithCounts });
  } catch (error) {
    return res.status(500).json({ success: false, error: error.message });
  }
};

// Update role & permissions
exports.updateRole = async (req, res) => {
  try {
    const { id } = req.params;
    const { role_name, description, permissions } = req.body;

    const role = await Role.findByPk(id);
    if (!role) {
      return res.status(404).json({ success: false, message: "Role not found" });
    }

    const updateData = {};
    if (role_name && role_name.trim() !== "") {
      updateData.role_name = role_name.trim();
    }
    if (description !== undefined) {
      updateData.description = description ? description.trim() : null;
    }
    if (permissions !== undefined) {
      let parsedPermissions = permissions;
      if (typeof permissions === "string") {
        try {
          parsedPermissions = JSON.parse(permissions);
        } catch (e) {
          parsedPermissions = permissions;
        }
      }
      updateData.permissions = parsedPermissions;
    }

    await role.update(updateData);
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

    // Protect built-in ADMIN role
    if (role.role_name.toUpperCase() === "ADMIN" || Number(id) === 2) {
      return res.status(400).json({ success: false, message: "System ADMIN role cannot be deleted" });
    }

    // Check if any employees are assigned to this role
    const assignedUsers = await User.count({ where: { role_id: id } });
    if (assignedUsers > 0) {
      return res.status(400).json({
        success: false,
        message: `Cannot delete role. There are ${assignedUsers} employee(s) assigned to this role. Please reassign them first.`,
      });
    }

    await role.destroy();
    return res.status(200).json({ success: true, message: "Role deleted successfully" });
  } catch (error) {
    return res.status(500).json({ success: false, error: error.message });
  }
};