const WareHouse = require("../../model/WareHouse")
const { ERROR } = require("../../Response/Error")
const { SUCCESS } = require("../../Response/Success")



exports.create = async (req, res) => {
    try {
        const { name, code, location, capacity, manager_name, contact_number, gst_number, license_number, address, google_link } = req.body

        const results = await WareHouse.create({
            name, code, location, capacity, manager_name, contact_number, gst_number, license_number, address, google_link
        })

        res.send(SUCCESS("Successfully Created!", results))
    } catch (error) {
        res.send(ERROR(error))
    }
}


exports.update = async (req, res) => {
    try {
        const { id } = req.params
        const { name, code, location, capacity, manager_name, contact_number, gst_number, license_number, address, google_link } = req.body

        const results = await WareHouse.update(
            { name, code, location, capacity, manager_name, contact_number, gst_number, license_number, address, google_link },
            {
                where: {
                    id: id
                }
            }
        )
        res.send(SUCCESS("Successfully update!" , results))
    } catch (error) {
        res.send(ERROR(error))
    }
}


exports.find = async (req, res) => {
    try {
        const results = await WareHouse.findAll({
            order: [["id", "DESC"]]
        })
        res.send(SUCCESS("records", results))
    } catch (error) {
        res.send(ERROR(error))
    }
}

exports.findbyid = async (req, res) => {
    try {
        const { id } = req.params
        const results = await WareHouse.findByPk(id);
        res.send(SUCCESS("records", results))
    } catch (error) {
        res.send(ERROR(error))
    }
}


exports.deletes = async (req, res) => {
    try {
            const {id} = req.params
            const results = await WareHouse.destroy({
                where:{id:id}
            })
        res.send(SUCCESS("Successfully deleted!", results))
    } catch (error) {
        res.send(ERROR(error))
    }
}