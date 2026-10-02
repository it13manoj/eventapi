const Companies = require("../../model/Company");
const { ERROR } = require("../../Response/Error");
const { SUCCESS } = require("../../Response/Success");
const { Op, fn, col, QueryTypes } = require("sequelize");


const getUploadedLogo = (req) => {
    if (req.files) {
        if (req.files.logo && req.files.logo[0]) return req.files.logo[0].filename;
        if (req.files.image && req.files.image[0]) return req.files.image[0].filename;
    }
    if (req.file) {
        return req.file.filename;
    }
    return null;
};

const sanitizePayload = (body) => {
    const payload = { ...body };
    if (payload.foundedYear !== undefined) {
        const parsed = parseInt(payload.foundedYear, 10);
        payload.foundedYear = isNaN(parsed) ? null : parsed;
    }
    if (payload.totalEvents !== undefined) {
        const parsed = parseInt(payload.totalEvents, 10);
        payload.totalEvents = isNaN(parsed) ? 0 : parsed;
    }
    if (payload.teamMembers !== undefined) {
        const parsed = parseInt(payload.teamMembers, 10);
        payload.teamMembers = isNaN(parsed) ? 0 : parsed;
    }
    return payload;
};

exports.create = async (req, res) => {
    try {
        const payload = sanitizePayload(req.body);
        const uploadedLogo = getUploadedLogo(req);
        if (uploadedLogo) {
            payload.logo = uploadedLogo;
        }

        const data = await Companies.create(payload);

        res.status(201).json({
            success: true,
            message: "Company created successfully",
            data
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

exports.getAll = async (req, res) => {
    try {
        const data = await Companies.findAll({
            order: [["id", "DESC"]]
        });

        res.json({
            success: true,
            data
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

exports.getById = async (req, res) => {
    try {
        let data = await Companies.findByPk(req.params.id);

        if (!data) {
            data = await Companies.findOne({ order: [["id", "ASC"]] });
        }

        if (!data) {
            return res.status(404).json({
                success: false,
                message: "Record not found"
            });
        }

        res.json({
            success: true,
            data
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

exports.update = async (req, res) => {
    try {
        let data = await Companies.findByPk(req.params.id);

        if (!data) {
            data = await Companies.findOne({ order: [["id", "ASC"]] });
        }

        const payload = sanitizePayload(req.body);
        const uploadedLogo = getUploadedLogo(req);
        if (uploadedLogo) {
            payload.logo = uploadedLogo;
        }

        if (!data) {
            // If no company exists yet, create one
            data = await Companies.create({
                companyName: payload.companyName || "Company Name",
                ...payload
            });
            return res.json({
                success: true,
                message: "Company profile created successfully",
                data
            });
        }

        await data.update(payload);

        // Fetch refreshed record
        const updatedRecord = await Companies.findByPk(data.id);

        res.json({
            success: true,
            message: "Company profile updated successfully",
            data: updatedRecord || data
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

exports.deletes = async (req, res) => {
    try {
        const data = await Companies.findByPk(req.params.id);

        if (!data) {
            return res.status(404).json({
                success: false,
                message: "Record not found"
            });
        }

        await data.destroy();

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