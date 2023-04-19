const { Op } = require("sequelize");
const { logError, logInfo } = require("./Logger");
const { objDeepCopy } = require("./ObjectHelper");


const findOne = async (model,
    condition,
    include = []) => {
    const response = await model.findOne({
        where: condition,

        include: include
    })
        .catch(error => {
            logError(error.name);

            logError(error.message);

            return {
                error: "Error en la consulta"
            }
        });

    return response;
};


const findAll = async (model,
    condition,
    include = [],
    order = [['createdAt', 'ASC']]) => {
    const response = await model.findAll({
        where: condition,

        include: include,

        order: order
    }).catch(error => {
        logError(error.name);

        logError(error.message);

        return {
            error: "Error en la consulta."
        }
    });

    return response;
};

const create = async (model, body, models = []) => {
    const response = await model.create(body, {
        include: models
    })
        .catch(error => {
            logError(error.name);

            logInfo(error);

            return {
                error: "Error en la creación."
            }
        });

    return response;
};

const update = async (model, body, condition) => {
    const response = await model.update(body, {
        where: condition
    })
        .catch(error => {
            logError(error.name);

            logError(error.message);

            return {
                error: "Error en la actualización."
            }
        });

    return response;
};

const destroy = async (model, condition) => {
    const response = await model.destroy({
        where: condition
    })
        .catch(error => {
            logError(error.name);

            logError(error.message);

            return {
                error: "Error en el borrado."
            }
        });

    return response;
};
module.exports = {
    findOne, findAll, create, update,
    destroy
};
