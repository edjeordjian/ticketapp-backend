
const Logger = require("../../services/helpers/Logger");

const { getFirebaseUserData } = require("../../services/authentication/FirebaseService");



const { userIsOrganizer, userExists } = require("../../services/users/UserService");

const { setErrorResponse } = require("../../services/helpers/ResponseHelper");

const { isEmpty } = require("../../services/helpers/ObjectHelper");
const { verifyToken } = require("../../services/authentication/FirebaseService")


const isOrganizerMiddleware = async (req, res, next) => {
    const token = req.headers.authorization.split(' ')[1];
    const decodedToken = await verifyToken(token);
    const isOrganizer = await userIsOrganizer(decodedToken.email);
    if (isOrganizer) {
        next();
    } else {
        return setErrorResponse("Acceso solo para organizadores.", res, 401);
    }

}

const emptyBodyMiddleware = async (req, res, next) => {
    if (req.method === "POST" && isEmpty(req.body)) {
        Logger.logInfo(req.body);
        return setErrorResponse("Error en la petición.", res, 400);
    } else {
        next();
    }
}

const firebaseAuthMiddleware = async (req, res, next) => {
    let token;

    if (req.headers.expo && req.headers.authorization) {
        const userData = await getFirebaseUserData(req.headers.authorization.split(" ")[1]);

        if (userData.id) {
            next();
        } else {
            return setErrorResponse("No autorizado", res, 400);
        }
    } else {
        if (req.headers.authorization && req.headers.authorization.split(' ')[0] === 'Bearer') {
            token = req.headers.authorization.split(' ')[1];
        } else {
            return setErrorResponse("No autorizado", res, 400);
        }
        const decodedToken = await verifyToken(token);
        if (decodedToken === false) {
            return setErrorResponse("Token inválido. Por favor volver a ingresar.", res, 400);
        } else {
            const exists = await userExists(decodedToken.email);
            if (exists) {
                req.decodedToken = decodedToken;
                next();
            } else {
                return setErrorResponse("Falta ingresar", res, 400);
            }
        }
    }
}
module.exports = {
    firebaseAuthMiddleware, emptyBodyMiddleware, isOrganizerMiddleware
}