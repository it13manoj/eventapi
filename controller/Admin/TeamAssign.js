const TeamAssign = require("../../model/TeamAssign");
const TeamAssignUser = require("../../model/TeamAssignUser")
const Events = require("../../model/Events");
const User = require("../../model/User");
const sequelize = require("../../db/conenction");


exports.createTeamAssign = async (req, res) => {
    try {
        const {
            employees, // [1,2,3]
            installDate,
            uninstallation,
            event_id
        } = req.body;

        const event = await TeamAssign.create({
            installing: installDate,
            uninstalling: uninstallation,
            event_id,
        });

        const data = employees.map((id) => ({
            user_id: id,
            event_id: event_id,
            team_assign_id: event.id,
        }));

        const assigenTeams = await TeamAssignUser.bulkCreate(data);
        await Events.update(
            { status: "1" },   // values to update
            {
                where: {
                    id: event_id
                }
            }
        );


        res.json({ success: true, data: event });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};


exports.findInstallUnInstallDate = async (req, res) => {
    try {
        const { id } = req.params;
        const event = await TeamAssign.findAll({
            where: {
                event_id: id
            }
        })
        res.json({ success: true, data: event });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
}


exports.find = async (req, res) => {
    try {
        const { id } = req.params;
        const event = await sequelize.query(
            `
  SELECT
    tms.id,
      u.name,
      u.contact,
      u.gender,
      u.email,
      u.sifting_type
  FROM users u
  INNER JOIN team_assign_users tms
      ON tms.user_id = u.id
  INNER JOIN team_assigns ta
      ON ta.id = tms.team_assign_id
  WHERE ta.event_id = :eventId
  ORDER BY u.name DESC
  `,
            {
                replacements: { eventId: id },
                type: sequelize.QueryTypes.SELECT,
            }
        );

        res.json({ success: true, data: event });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};




exports.findByUserId = async (req, res) => {
    try {
        const { id } = req.params;
        const event = await sequelize.query(
            `
           SELECT
    tms.assignedAt AS presentToDate,
    tms.assignedAt,
    e.nodb AS presentFromDate,
    u.sifting_type
FROM users u
INNER JOIN team_assign_users tms
    ON tms.user_id = u.id
INNER JOIN events e 
    ON e.id = tms.event_id
WHERE tms.user_id = :userId
ORDER BY u.name DESC;
            `,
            {
                replacements: { userId: id },
                type: sequelize.QueryTypes.SELECT,
            }
        );

        res.json({ success: true, data: event });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.deleteAssignUsers = async (req, res) => {
    try {
        const { id } = req.params;

        const deleted = await TeamAssignUser.destroy({
            where: {
                id: id,
            },
        });

        if (deleted === 0) {
            return res.status(404).json({
                success: false,
                message: "User assignment not found",
            });
        }

        return res.status(200).json({
            success: true,
            message: "User assignment deleted successfully",
        });

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

exports.updateTeamAssign = async (req, res) => {
    try {
        const { id } = req.params;
        const { installDate, uninstallation } = req.body;
        const result = await TeamAssign.update(
            { installing: installDate, uninstalling: uninstallation },
            { where: { id: id } }
        );
        res.json({ success: true, data: result });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.deleteTeamAssign = async (req, res) => {
    try {
        const { id } = req.params;
        await TeamAssignUser.destroy({ where: { team_assign_id: id } });
        const result = await TeamAssign.destroy({ where: { id: id } });
        res.json({ success: true, data: result });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};