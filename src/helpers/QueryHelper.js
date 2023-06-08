const {
    logError,
    logInfo
} = require("./Logger");


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


// TODO: Should receive a JSON as only attribute
const findAll = async (model,
    condition,
    include = [],
    order = [['createdAt', 'ASC']],
    attributes = { exclude: [] },
    group = [],
    raw = false) => {
    const response = await model.findAll({
        where: condition,

        include: include,

        order: order,

        attributes: attributes,

        group: group,

        raw: raw
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
