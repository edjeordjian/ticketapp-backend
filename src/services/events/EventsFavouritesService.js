const { Events } = require("../../data/model/Events");
const { User } = require("../../data/model/User");
const { create, findOne, findAll, update } = require("../../helpers/QueryHelper");

const {
    setOkResponse,
    setErrorResponse,
    setUnexpectedErrorResponse
} = require("../../helpers/ResponseHelper");

const handleAddFavourite = async (req,res) => {
    try {
        const {eventId, userId} = req.body;
        if (!eventId || !userId) {
            return setErrorResponse("La solicitud tiene que incluir eventId y userId",res);
        }
        const user = await findOne(User, {id: userId});
        const event = await findOne(Events, {id: eventId});

        if (!user || !event) {
            return setErrorResponse("La solicitud tiene que incluir eventId de un evnto existente y userId de un usuario existente",res);
        }

        await user.addFavouriteEvent(event);
        return setOkResponse(`Se agrego el evento ${event.name} como favorito de ${user.email}`,res);
    } catch (err){
        return setErrorResponse("Error agregando un favorito", res);
    }
}

const handleDeleteFavourite = async (req,res) => {
    try {
        const {eventId, userId} = req.body;
        if (!eventId || !userId) {
            return setErrorResponse("La solicitud tiene que incluir eventId y userId",res);
        }
        const user = await findOne(User, {id: userId});
        const event = await findOne(Events, {id: eventId});

        if (!user || !event) {
            return setErrorResponse("La solicitud tiene que incluir eventId de un evnto existente y userId de un usuario existente",res);
        }

        await user.removeFavouriteEvent(event);
        return setOkResponse(`Se elimino el evento ${event.name} como favorito de ${user.email}`,res);
    } catch (err){
        return setErrorResponse("Error borrando un favorito", res);
    }
}

module.exports = { handleAddFavourite, handleDeleteFavourite }
