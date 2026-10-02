const Category = require("../../model/Category")
const SubCategories = require("../../model/SubCategory")
const { ERROR } = require("../../Response/Error")
const { SUCCESS } = require("../../Response/Success")


exports.create = async (req, res) => {
    try {
        const { name, categories_id, code, description, is_enable } = req.body
        const subCategories = await SubCategories.create({
            name: name,
            categories_id: categories_id,
            code: code,
            is_enable,
            description: description
        })

        res.send(SUCCESS("Successfully Created SubCategories!", subCategories))
    } catch (error) {
        res.send(ERROR(error))
    }
}

exports.finds = async (req, res) => {
    try {
        const subCategories = await SubCategories.findAll({
            order:[["id","desc"]],
            include: [
                {
                    model: Category,
                    as: "categories"
                }
            ]
        })
        res.send(SUCCESS("Records", subCategories))
    } catch (error) {
        res.send(ERROR(error))
    }
}

exports.findByid = async (req, res) => {
    try {
        const { id } = req.params
        const results = await SubCategories.findAll({
            attributes: ['id', 'name', 'categories_id','is_enable'],
            where: {
                categories_id: id
            },
            include: [
                {
                    model: Category,
                    as: "categories"
                }
            ]
        });

        res.send(SUCCESS("records", results))
    } catch (error) {
        res.send(ERROR(error))
    }
}

exports.findBySubCategoryId = async (req, res) => {
    try {
        const { id } = req.params;
        const result = await SubCategories.findByPk(id, {
            include: [{ model: Category, as: "categories" }]
        });
        res.send(SUCCESS("records", result));
    } catch (error) {
        res.send(ERROR(error));
    }
}

exports.updates = async (req, res) => {
    try {
        const { id } = req.params
        const { name, categories_id, code, description, is_enable, status } = req.body
        const updateData = { name, categories_id, code, description };
        if (is_enable !== undefined) updateData.is_enable = is_enable;
        if (status !== undefined) updateData.status = status;

        const subCategories = await SubCategories.update(updateData, {
            where: { id: id }
        })
        res.send(SUCCESS("Successfully updated! ", subCategories))
    } catch (error) {
        res.send(ERROR(error))
    }
}


exports.deletes = async (req, res) => {
    try {
        const { id } = req.params
        const subCategories = await SubCategories.destroy({
            where: { id: id }
        })
        res.send(SUCCESS("SubCategory deleted", subCategories))
    } catch (error) {
        res.send(ERROR(error))
    }
}