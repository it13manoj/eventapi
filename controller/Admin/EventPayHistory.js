const EventPayHistory = require("../../model/EventPayHistory");
const { ERROR } = require("../../Response/Error")
const { SUCCESS } = require("../../Response/Success")


exports.create = async (req, res) => {
    try {
        const {
            event_id,
            price,
            remaining,
            paid_date
        } = req.body;

        const payment = await EventPayHistory.create({
            event_id,
            price,
            remaining,
            paid_date
        });

        return res.send(SUCCESS("Payment created successfully.", payment));
    } catch (err) {
        return res.send(ERROR(err));
    }
};

// =============================
// Get All Payments
// =============================
exports.findAll = async (req, res) => {
    try {
        const payments = await EventPayHistory.findAll({
            order: [["id", "DESC"]]
        });

        return res.send(SUCCESS("Payment history fetched successfully.", payments));
    } catch (err) {
        return res.send(ERROR(err));
    }
};

// =============================
// Get Payment By ID
// =============================
exports.findById = async (req, res) => {
    try {
        const payment = await EventPayHistory.findByPk(req.params.id);

        if (!payment) {
            return res.send(ERROR("Payment not found."));
        }

        return res.send(SUCCESS("Payment found.", payment));
    } catch (err) {
        return res.send(ERROR(err));
    }
};

// =============================
// Get Payments By Event Id
// =============================
exports.findByEventId = async (req, res) => {
    try {
        const payments = await EventPayHistory.findAll({
            where: {
                event_id: req.params.eventId
            },
            order: [["paid_date", "DESC"]]
        });

        return res.send(SUCCESS("Payment history fetched.", payments));
    } catch (err) {
        return res.send(ERROR(err));
    }
};

// =============================
// Update Payment
// =============================
exports.update = async (req, res) => {
    try {

        const payment = await EventPayHistory.findByPk(req.params.id);

        if (!payment) {
            return res.send(ERROR("Payment not found."));
        }

        await payment.update({
            event_id: req.body.event_id,
            price: req.body.price,
            remaining: req.body.remaining,
            paid_date: req.body.paid_date
        });

        return res.send(SUCCESS("Payment updated successfully.", payment));

    } catch (err) {
        return res.send(ERROR(err));
    }
};

// =============================
// Delete Payment
// =============================
exports.delete = async (req, res) => {
    try {

        const payment = await EventPayHistory.findByPk(req.params.id);

        if (!payment) {
            return res.send(ERROR("Payment not found."));
        }

        await payment.destroy();

        return res.send(SUCCESS("Payment deleted successfully."));

    } catch (err) {
        return res.send(ERROR(err));
    }
};