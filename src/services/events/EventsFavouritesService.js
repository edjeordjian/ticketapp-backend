const { getUserId } = require("../authentication/FirebaseService");
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
        const {event_id, is_favourite} = req.body;

        const userId = await getUserId(req);

        if (!event_id || !userId) {
            return setErrorResponse("Falta información en la solicitud",res);
        }
        const user = await findOne(User, {id: userId});
        const event = await findOne(Events, {id: event_id});

        if (!user || !event) {
            return setErrorResponse("La solicitud tiene que incluir eventId de un evnto existente y userId de un usuario existente",res);
        }

        if (is_favourite) {
            await user.addFavouriteEvent(event);

            return setOkResponse(`Se agrego el evento ${event.name} como favorito de ${user.email}`,res);
        } else {
            await user.removeFavouriteEvent(event);

            return setOkResponse(`Se elimino el evento ${event.name} como favorito de ${user.email}`,res);
        }
    } catch (err){
        return setUnexpectedErrorResponse("Error inesperado.", res);
    }
}

module.exports = { handleAddFavourite }
