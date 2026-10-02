const { Op } = require("sequelize");
const Vehicle = require("../../model/Vehicle")
const VehicleType = require("../../model/VehicleType")
const { ERROR } = require("../../Response/Error")
const { SUCCESS } = require("../../Response/Success")



exports.create = async (req, res) => {
    try {
        const {
            name,
            vehicle_number,
            vehicle_type_id,
            owner_agency,
            contact,
            driver_contact,
            ownershiptype,
            load_capacity,
            commission,
            insurance
        } = req.body;

        // ✅ FIX HERE
        const image = req.file ? req.file.filename : null;
        const resolvedOwnership = ownershiptype || (commission ? "Agency" : "Owner");

        const results = await Vehicle.create({
            name,
            vehicle_number,
            vehicle_type_id,
            owner_agency,
            contact,
            driver_contact,
            ownershiptype: resolvedOwnership,
            load_capacity,
            commission,
            insurance,
            image
        });

        res.send(SUCCESS("Successfully Created", results));
    } catch (error) {
        res.send(ERROR(error));
    }
};


exports.update = async (req, res) => {
    try {
        const { id } = req.params
        const { name, vehicle_number, vehicle_type_id, owner_agency, contact, driver_contact, ownershiptype, load_capacity, commission, insurance } = req.body
        const updatePayload = {
            name, vehicle_number, vehicle_type_id, owner_agency, contact, driver_contact, ownershiptype, load_capacity, commission, insurance
        };
        if (req.file && req.file.filename) {
            updatePayload.image = req.file.filename;
        }
        const results = await Vehicle.update(updatePayload, {
            where: {
                id: id
            }
        })
        res.send(SUCCESS("Successfully updated!", results))
    } catch (error) {
        res.send(ERROR(error))
    }
}

exports.find = async (req, res) => {
    try {
        const results = await Vehicle.findAll({
            include: [
                {
                    model: VehicleType,   // ✅ FIXED
                    as: "vehiclesTypes"
                }
            ],
            order: [["id", "DESC"]],
        });

        res.send(SUCCESS("records", results));
    } catch (error) {
        res.send(ERROR(error));
    }
};

exports.findById = async (req, res) => {
    try {
        const { id } = req.params
        const results = await Vehicle.findByPk(id, {
            include: [
                {
                    model: VehicleType,
                    as: "vehiclesTypes"
                }
            ]
        });
        res.send(SUCCESS("Records", results))
    } catch (error) {
        res.send(ERROR(error))
    }
}

exports.agentVehicle = async (req, res) => {
    try {
        const { type, name } = req.params;

        const where = {};

        if (type === "AGENT" || type === "Agency") {
            where.ownershiptype = "Agency";
            if (name && name !== "null" && name !== "undefined") {
                where.owner_agency = name;
            }
        } else {
            // OWNER: match 'Owner', 'OWNER', null, or empty string
            where[Op.or] = [
                { ownershiptype: "Owner" },
                { ownershiptype: "OWNER" },
                { ownershiptype: null },
                { ownershiptype: "" }
            ];
        }

        const results = await Vehicle.findAll({
            where,
            include: [
                {
                    model: VehicleType,
                    as: "vehiclesTypes"
                }
            ]
        });

        res.send(SUCCESS("Records", results));
    } catch (error) {
        res.send(ERROR(error));
    }
};


exports.findByVehicletype = async (req, res) => {
    try {
        const { id } = req.params
        const results = await Vehicle.findAll({
            where: { vehicle_type_id: id },
            include: [
                {
                    model: VehicleType,
                    as: "vehicles",
                }
            ]
        })
        res.send(SUCCESS("records", results))
    } catch (error) {
        res.send(ERROR(error))
    }
}


exports.delets = async (req, res) => {
    try {
        const { id } = req.params
        const results = await Vehicle.destroy({
            where: { id: id }
        })
        res.send(SUCCESS("Successfully Deleted!", results))
    } catch (error) {
        res.send(ERROR(error))
    }
}
exports.deletes = exports.delets;