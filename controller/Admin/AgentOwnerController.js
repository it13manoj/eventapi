
const AgentOwnerName = require("../../model/AgentOwnerName");
const { ERROR } = require("../../Response/Error")
const { SUCCESS } = require("../../Response/Success")

exports.create = async (req, res) => {
    try {
        const { name, owner_agency, status } = req.body;

        const result = await AgentOwnerName.create({
            name,
            owner_agency,
            status
        });

        res.status(201).json({
            success: true,
            message: "Agent Owner created successfully",
            data: result
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// Get All
exports.getAll = async (req, res) => {
    try {
        const result = await AgentOwnerName.findAll({
            order: [["id", "DESC"]]
        });

        res.json({
            success: true,
            data: result
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// Get By Id
exports.getById = async (req, res) => {
    try {
        const result = await AgentOwnerName.findByPk(req.params.id);

        if (!result) {
            return res.status(404).json({
                success: false,
                message: "Record not found"
            });
        }

        res.json({
            success: true,
            data: result
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

exports.agents = async (req, res) => {
    try {
        const result = await AgentOwnerName.findAll({
            where: {
                owner_agency: 2,
            },
            order: [["id", "DESC"]],
        });

        if (result.length === 0) {
            return res.status(404).json({
                success: false,
                message: "No records found",
                data: [],
            });
        }

        return res.status(200).json({
            success: true,
            message: "Records fetched successfully",
            data: result,
        });

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

// Update
exports.update = async (req, res) => {
    try {
        const result = await AgentOwnerName.findByPk(req.params.id);

        if (!result) {
            return res.status(404).json({
                success: false,
                message: "Record not found"
            });
        }

        await result.update(req.body);

        res.json({
            success: true,
            message: "Updated successfully",
            data: result
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// Delete
exports.deletes = async (req, res) => {
    try {
        const result = await AgentOwnerName.findByPk(req.params.id);

        if (!result) {
            return res.status(404).json({
                success: false,
                message: "Record not found"
            });
        }

        await result.destroy();

        res.json({
            success: true,
            message: "Deleted successfully"
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};