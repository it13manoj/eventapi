const AttendanceRecord = require("../../model/AttendanceRecord");
const { Op } = require("sequelize");

exports.getByUserId = async (req, res) => {
    try {
        const { userId } = req.params;
        const { year, month } = req.query;

        const whereClause = {
            user_id: userId,
        };

        if (year && month) {
            const m = String(month).padStart(2, "0");
            const startDate = `${year}-${m}-01`;
            const lastDay = new Date(Number(year), Number(month), 0).getDate();
            const endDate = `${year}-${m}-${String(lastDay).padStart(2, "0")}`;

            whereClause.date = {
                [Op.between]: [startDate, endDate],
            };
        }

        const records = await AttendanceRecord.findAll({
            where: whereClause,
            order: [["date", "ASC"]],
        });

        res.json({
            success: true,
            data: records,
            results: records,
        });
    } catch (error) {
        console.error("Error fetching attendance records:", error);
        res.status(500).json({
            success: false,
            error: error.message,
        });
    }
};

exports.markAttendance = async (req, res) => {
    try {
        const {
            user_id,
            date,
            status,
            reason,
            event_id,
            shifts_count,
            hours_worked,
            shift_name,
        } = req.body;

        if (!user_id || !date) {
            return res.status(400).json({
                success: false,
                message: "user_id and date are required",
            });
        }

        // If status is 'reset' or empty, remove the override
        if (status === "reset" || status === "clear") {
            await AttendanceRecord.destroy({
                where: {
                    user_id,
                    date,
                },
            });
            return res.json({
                success: true,
                message: "Attendance override reset to default",
                data: null,
            });
        }

        const normalizedStatus = status === "present" ? "present" : "absent";
        const parsedShifts = shifts_count ? parseInt(shifts_count) : 1;
        const parsedHours = hours_worked ? parseFloat(hours_worked) : 8;

        // Find existing or create
        const existing = await AttendanceRecord.findOne({
            where: { user_id, date },
        });

        let record;
        if (existing) {
            existing.status = normalizedStatus;
            if (reason !== undefined) existing.reason = reason;
            if (event_id !== undefined) existing.event_id = event_id;
            existing.shifts_count = parsedShifts;
            existing.hours_worked = parsedHours;
            if (shift_name !== undefined) existing.shift_name = shift_name;
            await existing.save();
            record = existing;
        } else {
            record = await AttendanceRecord.create({
                user_id,
                date,
                status: normalizedStatus,
                reason: reason || (normalizedStatus === "absent" ? "Marked absent by admin" : null),
                event_id: event_id || null,
                shifts_count: parsedShifts,
                hours_worked: parsedHours,
                shift_name: shift_name || (parsedShifts > 1 ? `${parsedShifts} Shifts` : "1st Shift"),
            });
        }

        res.json({
            success: true,
            message: `Attendance marked as ${normalizedStatus} successfully`,
            data: record,
            results: record,
        });
    } catch (error) {
        console.error("Error marking attendance:", error);
        res.status(500).json({
            success: false,
            error: error.message,
        });
    }
};

exports.removeAttendance = async (req, res) => {
    try {
        const { userId, date } = req.params;

        await AttendanceRecord.destroy({
            where: {
                user_id: userId,
                date,
            },
        });

        res.json({
            success: true,
            message: "Attendance override removed successfully",
        });
    } catch (error) {
        console.error("Error removing attendance override:", error);
        res.status(500).json({
            success: false,
            error: error.message,
        });
    }
};

