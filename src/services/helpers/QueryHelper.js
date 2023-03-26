const Logger = require("./Logger");

const findOne = async (model,
                       condition) => {
    const response = await model.findOne( {
        where: condition
    } )
        .catch(error => {
            Logger.error(error.stack);

            return {
                error: "Error en la consulta"
            }
        } );

    return response;
};

const findAll = async (model,
                       condition) => {
   const response = await model.findAll( {
        where: condition
    } )
        .catch(error => {
            Logger.error(error.stack);

            return {
                error: "Error en la consulta."
            }
        } );

    return response;
};

const create = async (model,
                      body) => {
    const response = await model.create(body)
        .catch(error => {
            Logger.error(error.stack);

            return {
                error: "Error en la creación."
            }
        } );

    return response;
};

const update = async (model,
                      body,
                      condition) => {
    const response = await model.update(body, {
            where: condition
        } )
        .catch(error => {
            Logger.error(error.stack);

            return {
                error: "Error en la actualización."
            }
        } );

    return response;
};

const destroy = async (model,
                       condition) => {
    const response = await model.destroy( {
            where: condition
        } )
        .catch(error => {
            Logger.error(error.stack);

            return {
                error: "Error en el borrado."
            }
        } );

    return response;
};

module.exports = {
    findOne, findAll, create, update,
    destroy,
};
