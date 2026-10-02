const VehicleType = require("../../model/VehicleType")
const { ERROR } = require("../../Response/Error")
const { SUCCESS } = require("../../Response/Success")

exports.create =  async (req, res) =>{
        try{
            const { name, wheel, capacity, description, fuel_type }= req.body
            const results = await VehicleType.create({
                 name, wheel, capacity, description, fuel_type
            })
            res.send(SUCCESS("Successfully Created!" , results))
        }catch(error){
            res.send(ERROR(error))
        }
}


exports.update =  async (req, res) =>{
        try{
            const { id } = req.params
            const {name, wheel, capacity, description, fuel_type}= req.body
            const result = await VehicleType.update({
                name, wheel, capacity, description, fuel_type
            },{
                where:{
                    id:id
                }
            })
            res.send(SUCCESS("Successfully updated", result))
        }catch(error){
            res.send(ERROR(error))
        }
}


exports.find =  async (req, res) =>{
        try{
            const results = await VehicleType.findAll({
                order:[["id","DESC"]]
            });

            res.send(SUCCESS("Records", results))
        }catch(error){
            res.send(ERROR(error))
        }
}


exports.findById = async (req, res) =>{
        try{
            const { id } = req.params
            const results = await VehicleType.findByPk(id)
            res.send(SUCCESS("Records", results))
        }catch(error){
            res.send(ERROR(error))
        }
}


exports.deletes =  async (req, res) =>{
        try{
            const { id } = req.params
            const results = await  VehicleType.destroy({
                where:{
                    id:id
                }
            })

            res.send(SUCCESS("Successfully Deleted!" , results))
        }catch(error){
            res.send(ERROR(error))
        }
}