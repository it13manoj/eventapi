const Categories = require("../../model/Category")
const { ERROR } = require("../../Response/Error")
const { SUCCESS } = require("../../Response/Success")

exports.create = async (req,res) =>{
    try{
        const {name, code, description} = req.body
        const category = await Categories.create({name:name, code:code, description:description})
        res.send(SUCCESS("successfully created!" , category))
    }catch(error){
        res.send(ERROR(error))
    }
}


exports.find = async (req,res) =>{
        try{
            const categories = await Categories.findAll()
            res.send(SUCCESS("successfully records!", categories));
        }catch(error){  
            res.send(error)
        }
}



exports.findByid = async (req,res) =>{
        try{
            const { id } = req.params
            const categories = await Categories.findByPk(id)
            res.send(SUCCESS("successfully records!", categories));
        }catch(error){  
            res.send(error)
        }
}


exports.updates = async (req,res) =>{
        try{
            const { id } = req.params
            const { name, status, description, code } = req.body
            const category = await Categories.update({
                 name, status, description, code
            },{
                where:{id:id}
            })

            res.send(SUCCESS("successfully updated!", category))
        }catch(error){
                res.send(ERROR(error))
        }
}


exports.deletes = async (req,res) =>{
     try{
        const { id } = req.params
            const categories = await Categories.destroy({
                where:{id:id}
            })
            res.send(SUCCESS("Successfully Delete!" , categories))
     }catch(error){ 
            res.send(ERROR(error))
     }
}
