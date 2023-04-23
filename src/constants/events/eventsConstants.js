const EVENT_ALREADY_EXISTS_ERR_LBL = "Ya existe un evento con ese nombre";

const EVENT_WITH_NO_CAPACITY_ERR_LBL = "El evento tiene una capacidad inválida";

const MISSING_EVENT_ATTRIBUTE_ERR_LBL = "Falta especificar datos del evento."

const EVENT_CREATE_ERR_LBL = "Error al crear el evento";

const EVENT_DOESNT_EXIST_ERR_LBL = "No existe el evento indicado"

const EVENT_ALREADY_BOOKED = "El usuario ya se registró en el evento."

const EVENT_ALREADY_ASISTED = "La entrada ya fue utilizada.";

const USER_NOT_REGISTERED = "La entrada presentada no corresponde a este evento.";

const INVALID_CODE_ERR_LBL = "Código inválido.";

const MAX_EVENT_CAPACITY = 1000000;

module.exports = {
    EVENT_ALREADY_EXISTS_ERR_LBL, EVENT_WITH_NO_CAPACITY_ERR_LBL,
    MISSING_EVENT_ATTRIBUTE_ERR_LBL, EVENT_CREATE_ERR_LBL, EVENT_DOESNT_EXIST_ERR_LBL,
    MAX_EVENT_CAPACITY, EVENT_ALREADY_BOOKED, EVENT_ALREADY_ASISTED,
    USER_NOT_REGISTERED, INVALID_CODE_ERR_LBL
};
