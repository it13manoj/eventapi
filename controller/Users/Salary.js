const Salary = require("../../model/Salary")
const { ERROR } = require("../../Response/Error")
const { SUCCESS } = require("../../Response/Success")

exports.create = async (req, res)=>{
    
    try {
        const { paid, remaing, user_id, extra_pay} = req.body
        const result = await Salary.create({
            paid, remaing, extra_pay, user_id
        })
        res.send(SUCCESS("recoreds", result));
    } catch (error) {
        res.send(ERROR(error))
    }
}



exports.findByid =  async (req,res) =>{
    try {
        const {id} = req.params;
        const result = await Salary.findAll({
            where: {user_id: id}
        });
        res.send(SUCCESS("recoreds", result));
    } catch (error) {
        res.send(ERROR(error))
    }
}


exports.findAll = async ( req, res) =>{
    try {
        const result = await Salary.findAll({
            order:[["id","desc"]]
        })
        res.send(SUCCESS("recoreds", result) )
    } catch (error) {
        res.send(ERROR(error))
    }
}

exports.update = async (req, res) => {
    try {
        const { id } = req.params;
        const { paid, remaing, user_id, extra_pay } = req.body;
        const result = await Salary.update({
            paid, remaing, extra_pay, user_id
        }, {
            where: { id }
        });
        res.send(SUCCESS("Salary updated successfully", result));
    } catch (error) {
        res.send(ERROR(error));
    }
};

exports.deletes = async (req, res) => {
    try {
        const { id } = req.params;
        const result = await Salary.destroy({
            where: { id }
        });
        res.send(SUCCESS("Salary deleted successfully", result));
    } catch (error) {
        res.send(ERROR(error));
    }
};